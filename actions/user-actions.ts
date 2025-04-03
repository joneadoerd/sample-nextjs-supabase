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
    throw new Error("Unauthorized: No user found");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  return profile;
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
  const supabase = await createClient();
  const { error, data } = await supabase.auth.admin.createUser(user);
  await prisma.profile.update({
    where: { id: data.user?.id },
    data: user,
  });
  revalidatePath("/");

  if (error) {
    throw new Error(error.message);
  }
}

// 🟡 Update User Role (Admin Only)
export async function updateUser(user: ProfileOptionalDefaults) {
  if (!(await isAdmin())) throw new Error("Access Denied");

  const updatedUser = await prisma.profile.update({
    where: { id: user.id },
    data: user,
  });
  revalidatePath("/");
  return updatedUser;
}

// 🔴 Delete User (Admin Only)
export async function deleteUser(userId: string) {
  if (!(await isAdmin())) throw new Error("Access Denied");

  const deletedUser = await prisma.profile.delete({
    where: { id: userId },
  });
  revalidatePath("/");
  return deletedUser;
}
