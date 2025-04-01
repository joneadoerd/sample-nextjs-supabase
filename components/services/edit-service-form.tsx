"use client";

import type React from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { serviceSchema, type ServiceFormValues } from "@/lib/service-schema";
import { updateService } from "@/lib/service-actions";
import {
  Profile,
  ServiceOptionalDefaultsWithPartialRelations,
} from "@/prisma/types";
import { getAllUsers } from "@/actions/user-actions";

interface EditServiceFormProps {
  service: ServiceOptionalDefaultsWithPartialRelations;
}

export default function EditServiceForm({ service }: EditServiceFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const ServiceImages = service?.images?.map((image) => image.url || "") || [];
  const [imageUrls, setImageUrls] = useState<string[]>(ServiceImages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);

  const currentUser = service.user || {};
  const isAdminUser = currentUser.role === "admin";
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  // Check if the current user is authorized to edit this service
  const isAuthorized = isAdminUser || service.userId === currentUser.id;

  // Initialize the form
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
      date: new Date(service.date),
      images: [],
      userId: service.userId,
    },
  });

  if (!isAuthorized) {
    // In a real app, you might want to redirect or show an error message
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-destructive">
              Unauthorized
            </h2>
            <p className="text-muted-foreground mt-2">
              You don't have permission to edit this service.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    form.setValue("images", [...images, ...newFiles]);

    // Create preview URLs for the images
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newUrls]);
  };

  // Remove an image
  const removeImage = (index: number) => {
    // If it's an existing image from the service
    if (index < ServiceImages.length) {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // If it's a newly uploaded image
    const newImageIndex = index - ServiceImages.length;
    const updatedImages = images.filter((_, i) => i !== newImageIndex);
    setImages(updatedImages);
    form.setValue("images", updatedImages);

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data: ServiceFormValues) => {
    try {
      setIsSubmitting(true);

      // In a real app, you would upload the images to a storage service
      // and get back URLs to store in the database
      const newImageUrls = images.map(
        (_, index) => `https://example.com/image-${index}.jpg`
      );

      // Combine existing images that weren't removed with new ones
      const finalImageUrls = [
        ...imageUrls.filter((_, i) => i < ServiceImages.length),
        ...newImageUrls,
      ];

      // Update service
      const result = await updateService({
        id: service.id,
        name: data.name,
        date: data.date,
        images: finalImageUrls.map((url) => ({ url })),
        description: data.description,
        userId: isAdminUser && data.userId ? data.userId : service.userId,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Service updated successfully");

      // Redirect to the service details page
      router.push(`/services`);
      router.refresh();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(
        "There was an error updating your service. Please try again."
      );
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
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                              onClick={() => removeImage(index)}
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
                    <Textarea
                      placeholder="Describe your service"
                      className="min-h-32"
                      {...field}
                    />
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
              )}
              Update Service
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
