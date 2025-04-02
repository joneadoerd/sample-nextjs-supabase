"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  Service,
  ServiceOptionalDefaultsWithPartialRelations,
  SubscriptionPartialSchema,
  SubscriptionStatusSchema,
} from "@/prisma/types";
import { prisma } from "./db";
import { getCurrentUserProfile } from "@/actions/user-actions";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Get all services
export async function getServices(): Promise<{
  services?: ServiceOptionalDefaultsWithPartialRelations[];
  error?: string;
}> {
  try {
    return {
      services: await prisma.service.findMany({
        include: { images: true, user: true },
      }),
    };
  } catch (error) {
    // console.error("Error fetching services:", error);
    return { error: "Failed to fetch services" };
  }
}
// Get all services
export async function getAllActiveServices(): Promise<{
  services?: ServiceOptionalDefaultsWithPartialRelations[];
  error?: string;
}> {
  try {
    return {
      services:  await prisma.service.findMany({
        where: {
          user: {
            subscriptions: {
              status_subscription: SubscriptionStatusSchema.Enum.ACTIVE, // Filter for active subscriptions
            },
          },
        },
        include: {
          user: true, // Include user details
          images: true, // Include service images
        },
      })
    };
  } catch (error) {
    // console.error("Error fetching services:", error);
    return { error: "Failed to fetch active services"};
  }
}

// Get a service by ID
export async function getServiceById(id: string): Promise<{
  service?: ServiceOptionalDefaultsWithPartialRelations;
  error?: string;
}> {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { images: true, user: true },
    });

    if (!service) {
      return { error: "Service not found" };
    }

    return { service };
  } catch (error) {
    // console.error("Error fetching service:", error);
    return { error: "Failed to fetch service" };
  }
}
export async function getServiceByUserId(id: string): Promise<{
  service?: ServiceOptionalDefaultsWithPartialRelations;
  error?: string;
}> {
  try {
    const service = await prisma.service.findUnique({
      where: {userId: id },
      include: { images: true, user: true },
    });

    if (!service) {
      return { error: "Service not found" };
    }

    return { service };
  } catch (error) {
    // console.error("Error fetching service:", error);
    return { error: "Failed to fetch service" };
  }
}
// Create a new service
export async function createService(
  data: ServiceOptionalDefaultsWithPartialRelations
): Promise<{ service?: Service; error?: string }> {
  try {
    // Mock current user check - in a real app, this would use your auth system
    const currentUser = await getCurrentUserProfile();

    // Security check: Only admins can create services for other users
    if (data.userId !== currentUser?.id && currentUser?.role !== "admin") {
      return {
        error: "Unauthorized: You can only create services for yourself",
      };
    }

    // Log the data that would be saved
    // console.log("Creating service:", data)
    const newService = await prisma.service.create({
      data: {
        images: {
          create: data.images?.map((image) => ({
            url: image.url ?? "/placeholder.svg?height=200&width=400",
          })),
        },
        name: data.name,
        date: data.date,
        description: data.description,
        userId: data.userId,
      },
      include: { images: true },
    });

    // Revalidate the services page
    revalidatePath("/services");

    const user = prisma.profile.findFirst({
      where: {
        id: data.userId,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }

    return { service: newService };
  } catch (error) {
    // console.error("Error creating service:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "A service with this name already exists" };
      }
    }

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to create service" };
  }
}
export async function createOrUpdateService(
  data: ServiceOptionalDefaultsWithPartialRelations
) {
  if (data.id) {
    return await updateService(data);
  } else {
    return await createService(data);
  }
}

// Update an existing service
export async function updateService(
  data: ServiceOptionalDefaultsWithPartialRelations
): Promise<{ service?: Service; error?: string }> {
  try {
    const currentUser = await getCurrentUserProfile();
    // Find the existing service
    const existingService = await prisma.service.findUnique({
      where: { id: data.id },
    });
    if (!existingService) {
      return { error: "Service not found" };
    }

    // Security check: Only admins or the service owner can update it
    if (
      existingService.userId !== currentUser?.id &&
      currentUser?.role !== "admin"
    ) {
      return { error: "Unauthorized: You can only update your own services" };
    }

    // Security check: Only admins can change the service owner
    if (
      data.userId !== existingService.userId &&
      currentUser.role !== "admin"
    ) {
      return { error: "Unauthorized: You cannot change the service owner" };
    }

    const user = prisma.profile.findFirst({
      where: {
        id: data.userId,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }
    await prisma.serviceImage.deleteMany({ where: { serviceId: data.id } });
    const update = await prisma.service.update({
      where: { id: data.id },
      data: {
        name: data.name,
        date: data.date,
        images: {
          create: data.images?.map((image) => ({
            url: image.url ?? "/placeholder.svg?height=200&width=400",
          })),
        },
        description: data.description,
        userId: data.userId,
      },
      include: { images: true },
    });
    // Revalidate the services page

    revalidatePath("/services");
    // In a real app, this would be handled by the database update
    // For our mock data, we'll just pretend it was updated
    return { service: update };
  } catch (error) {
    console.error("Error updating service:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to update service" };
  }
}
