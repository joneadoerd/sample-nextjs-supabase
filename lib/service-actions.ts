"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ServiceWithUser } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import {
  Service,
  ServicePartialRelations,
  ServiceSchema,
} from "@/prisma/types";
import { prisma } from "./db";
import { getCurrentUserProfile } from "@/actions/user-actions";

// Mock data for services
const mockServices: ServiceWithUser[] = [
  {
    id: "1",
    name: "Website Development",
    date: new Date("2023-06-15"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Website+Development+1",
      "/placeholder.svg?height=400&width=800&text=Website+Development+2",
      "/placeholder.svg?height=400&width=800&text=Website+Development+3",
    ],
    description:
      "Professional website development services. I can create responsive, modern websites for your business or personal needs. Using the latest technologies like React, Next.js, and Tailwind CSS.",
    price: 1200,
    userId: "1",
    user: mockUsers[0],
  },
  {
    id: "2",
    name: "Logo Design",
    date: new Date("2023-07-22"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Logo+Design+1",
      "/placeholder.svg?height=400&width=800&text=Logo+Design+2",
    ],
    description:
      "Creative logo design services. I'll create a unique and memorable logo that represents your brand identity. Includes multiple revisions and different file formats.",
    price: 300,
    userId: "2",
    user: mockUsers[1],
  },
  {
    id: "3",
    name: "Social Media Management",
    date: new Date("2023-08-10"),
    images: [
      "/placeholder.svg?height=400&width=800&text=Social+Media+1",
      "/placeholder.svg?height=400&width=800&text=Social+Media+2",
      "/placeholder.svg?height=400&width=800&text=Social+Media+3",
    ],
    description:
      "Complete social media management for your business. I'll handle content creation, posting schedule, and engagement with your audience across multiple platforms.",
    price: 500,
    userId: "3",
    user: mockUsers[2],
  },
];

// Get all services
export async function getServices(): Promise<{
  services?: ServiceWithUser[];
  error?: string;
}> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    return { services: mockServices };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { error: "Failed to fetch services" };
  }
}

// Get a service by ID
export async function getServiceById(
  id: string
): Promise<{ service?: ServiceWithUser; error?: string }> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const service = mockServices.find((service) => service.id === id);

    if (!service) {
      return { error: "Service not found" };
    }

    return { service };
  } catch (error) {
    console.error("Error fetching service:", error);
    return { error: "Failed to fetch service" };
  }
}

// Create a new service
export async function createService(
  data: Service
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

    // Validate the data

    const validatedData = data;

    // Log the data that would be saved
    // console.log("Creating service:", validatedData)
    const newService = await prisma.service.create({
      data: {
        name: validatedData.name,
        date: validatedData.date,
        images: validatedData.images || [],
        description: validatedData.description,
        userId: validatedData.userId,
      },
    });

    // Revalidate the services page
    revalidatePath("/services");

    const user = prisma.profile.findFirst({
      where: {
        id: validatedData.userId,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }

    return { service: newService };
  } catch (error) {
    console.error("Error creating service:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to create service" };
  }
}

// Update an existing service
export async function updateService(data: {
  id: string;
  name: string;
  date: Date;
  images: string[];
  description: string;
  userId: string;
}): Promise<{ service?: ServiceWithUser; error?: string }> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Mock current user check - in a real app, this would use your auth system
    const mockCurrentUser = {
      id: "1",
      role: "admin",
    };

    // Find the existing service
    const existingService = mockServices.find(
      (service) => service.id === data.id
    );
    if (!existingService) {
      return { error: "Service not found" };
    }

    // Security check: Only admins or the service owner can update it
    if (
      existingService.userId !== mockCurrentUser.id &&
      mockCurrentUser.role !== "admin"
    ) {
      return { error: "Unauthorized: You can only update your own services" };
    }

    // Security check: Only admins can change the service owner
    if (
      data.userId !== existingService.userId &&
      mockCurrentUser.role !== "admin"
    ) {
      return { error: "Unauthorized: You cannot change the service owner" };
    }

    // Validate the data
    const serviceSchema = z.object({
      id: z.string(),
      name: z.string().min(3),
      date: z.date(),
      images: z.array(z.string()),
      description: z.string().min(10),
      userId: z.string(),
    });

    const validatedData = serviceSchema.parse(data);

    // Log the data that would be saved
    console.log("Updating service:", validatedData);

    // Revalidate the services page
    revalidatePath(`/services/${data.id}`);
    revalidatePath("/services");

    const user = mockUsers.find((user) => user.id === validatedData.userId);
    if (!user) {
      return { error: "User not found" };
    }

    const updatedService = {
      ...existingService,
      name: validatedData.name,
      date: validatedData.date,
      images: validatedData.images,
      description: validatedData.description,
      userId: validatedData.userId,
      user,
    };

    // In a real app, this would be handled by the database update
    // For our mock data, we'll just pretend it was updated
    return { service: updatedService };
  } catch (error) {
    console.error("Error updating service:", error);

    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to update service" };
  }
}
