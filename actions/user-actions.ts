"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "./checkAdmin";
import { ProfileOptionalDefaults } from "@/prisma/types";

// Get Supabase instance

// 🟢 Get Current User Profile
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null; // Auth failed, not a server error
  }

  let attempts = 0;
  const maxRetries = 3;
  let lastError;

  while (attempts < maxRetries) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
      });

      if (profile) return profile;

      // If profile is null, retry (or you can choose to return null)
      throw new Error("Profile not found");
    } catch (err) {
      attempts++;
      lastError = err;

      // Optional: short delay between retries
      await new Promise((res) => setTimeout(res, 200));
    }
  }

  // All retries failed
  console.error("Failed to fetch profile after 3 attempts:", lastError);

  // Throwing will trigger Next.js error boundary / 500 page
  throw new Error("Server error: Unable to load user profile");
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.profile.findUnique({
      where: { id },
    });
    return { user };
  } catch (error) {
    return { error: "Failed to fetch user" };
  }
}
// 🔵 Get All Users (Admin Only)
export async function getAllUsers() {
  if (!(await isAdmin())) throw new Error("Access Denied");

  try {
    const users = await prisma.profile.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return { users };
  } catch (error) {
    return { error: "Failed to fetch users" };
  }
}

// 🟠 Create a New User (Admin Only)
export async function createUser(user: ProfileOptionalDefaults) {
  try {
    if (!(await isAdmin())) throw new Error("Access Denied");
    const supabase = await createClient();
    const { error, data } = await supabase.auth.admin.createUser(user);
    await prisma.profile.update({
      where: { id: data.user?.id },
      data: user,
    });
    revalidatePath("/");

    if (error) {
      return { error: "Failed to create user" };
    }
  } catch (error) {
    return { error: "Failed to create user" };
  }
}

// 🟡 Update User Role (Admin Only)
export async function updateUser(user: ProfileOptionalDefaults) {
  try {
    if (!(await isAdmin())) throw new Error("Access Denied");

    const updatedUser = await prisma.profile.update({
      where: { id: user.id },
      data: user,
    });
    revalidatePath("/");
    return updatedUser;
  } catch (error) {
    return { error: "Failed to update user" };
  }
}

// 🔴 Delete User (Admin Only)
export async function deleteUser(userId: string) {
  try {
    if (!(await isAdmin())) throw new Error("Access Denied");

    const deletedUser = await prisma.profile.delete({
      where: { id: userId },
    });
    revalidatePath("/");
    return deletedUser;
  } catch (error) {
    return { error: "Failed to delete user" };
  }
}
