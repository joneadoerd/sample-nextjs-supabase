"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "./db";
import {
  SubscriptionOptionalDefaultsWithPartialRelations,
  SubscriptionPartial,
  SubscriptionPartialSchema,
  SubscriptionSchema,
} from "@/prisma/types";

export async function getSubscriptions() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
      },
      orderBy: {
        start_date: "desc",
      },
    });
    return { subscriptions };
  } catch (error) {
    return { error: "Failed to fetch subscriptions" };
  }
}

export async function getSubscription(id: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!subscription) {
      return { error: "Subscription not found" };
    }

    return { subscription };
  } catch (error) {
    return { error: "Failed to fetch subscription" };
  }
}

export async function createSubscription(
  formData: SubscriptionOptionalDefaultsWithPartialRelations
) {
  try {
    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: formData.userId },
    });

    if (existingSubscription) {
      return { error: "User already has an active subscription" };
    }

    await prisma.subscription.create({
      data: {
        start_date: formData.start_date,
        expire_date: formData.expire_date,
        status_subscription: formData.status_subscription,
        userId: formData.userId,
      },
    });

    revalidatePath("/admin/subscriptions");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to create subscription" };
  }
}

export async function updateSubscription(
  formData: SubscriptionOptionalDefaultsWithPartialRelations
) {
  try {
    await prisma.subscription.update({
      where: { id: formData.id },
      data: {
        start_date: formData.start_date,
        expire_date: formData.expire_date,
        status_subscription: formData.status_subscription,
      },
    });

    revalidatePath("/admin/subscriptions");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    return { error: "Failed to update subscription" };
  }
}

export async function deleteSubscription(id: string) {
  try {
    await prisma.subscription.delete({
      where: { id },
    });

    revalidatePath("/admin/subscriptions");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete subscription" };
  }
}
