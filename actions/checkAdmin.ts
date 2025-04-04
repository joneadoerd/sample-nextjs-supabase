"use server";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

export async function isAdmin() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // console.error("Error fetching user:", error);
    return false; // User is not logged in
  }

  // Check the role in the database using Prisma
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });
    return profile?.role === "admin"; // Returns true if admin, otherwise false
  } catch (error) {
    console.error("Error fetching checkAdmin:", error);
    return false;
  }
}
