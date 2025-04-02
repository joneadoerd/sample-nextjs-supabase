"use server";
import { createClient } from "@/utils/supabase/server";

export const uploadImage = async (
  files: File[],
  userId: string
): Promise<{ error?: string; uploadedUrls?: string[] }> => {
  const supabase = await createClient();
  const uploadedUrls: string[] = [];
  for (const file of files) {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error);
      return { error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);
    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return { uploadedUrls: uploadedUrls };
};

export const removeImage = async (filePath: string) => {
  const supabase = await createClient();
  const { error } = await supabase.storage.from("images").remove([filePath]);
  return error;
};
