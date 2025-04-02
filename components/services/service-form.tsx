"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createOrUpdateService } from "@/lib/service-actions";
import {
  Profile,
  ServiceOptionalDefaults,
  ServiceOptionalDefaultsWithPartialRelations,
  ServiceOptionalDefaultsWithPartialRelationsSchema,
} from "@/prisma/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAllUsers } from "@/actions/user-actions";
import { removeImage, uploadImage } from "@/lib/images-storage";

interface ServiceFormProps {
  service?: ServiceOptionalDefaultsWithPartialRelations;
  user: Profile;
}

export default function ServiceForm({ service, user }: ServiceFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    service?.images?.map((image) => image.url || "") || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);
  const isAdminUser = user.role === "admin";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { users } = await getAllUsers();

        setUsers(users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (isAdminUser) {
      fetchUsers();
    }
  }, []);

  // Check if the current user is authorized to edit this service
  const form = useForm<ServiceOptionalDefaultsWithPartialRelations>({
    resolver: zodResolver(ServiceOptionalDefaultsWithPartialRelationsSchema),
    defaultValues: {
      userId: user.id,
      name: service?.name || "",
      description: service?.description || "",
      date: service?.date ? new Date(service.date) : new Date(),
      images: [],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const selectedUser = form.getValues("userId");
    if (!files) return;
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    form.setValue("images", [...images, ...newFiles] as any);
    const { error, uploadedUrls } = await uploadImage(newFiles, selectedUser);
    if (error) {
      toast.error("Failed to upload images.");
      return;
    }
    setImageUrls((prev) => [...prev, ...(uploadedUrls || [])]);
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = imageUrls[index];

    // Extract file path from the image URL
    const urlParts = imageUrl.split("/");
    const filePath = urlParts.slice(urlParts.indexOf("images") + 1).join("/");

    try {
      // Remove image from state after successful deletion
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
      // Remove image from Supabase storage
      const error = await removeImage(filePath);

      if (error) {
        toast.error("Failed to delete image from storage.");
        return;
      }

      toast.success("Image removed successfully.");
    } catch (error) {
      toast.error("An error occurred while deleting the image.");
    }
  };

  const onSubmit = async (data: ServiceOptionalDefaults) => {
    try {
      setIsSubmitting(true);

      await createOrUpdateService({
        id: service?.id,
        name: data.name,
        date: data.date,
        description: data.description,
        images: imageUrls.map((url) => ({ url })),
        userId: user.id,
      });

      toast.success(`Service ${service ? "updated" : "created"} successfully!`);
      router.push("/services");
      router.refresh();
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Button variant="outline">
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative w-24 h-24">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Images
                        </Button>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload images for your service (max 5 images).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Only show user selector for admin users */}
            {isAdminUser && (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      As an admin, you can reassign this service to another user
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              {service ? "Update" : "Create"} Service
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
