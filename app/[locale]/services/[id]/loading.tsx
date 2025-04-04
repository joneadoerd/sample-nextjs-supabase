"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ServiceLoading() {
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-9 w-[120px]" />
          </div>

          {/* Image Gallery Skeleton */}
          <div className="aspect-[16/9] overflow-hidden rounded-lg">
            <Skeleton className="h-full w-full" />
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-[100px]" />
            </div>

            <Separator className="my-6" />

            {/* Description Section */}
            <div>
              <Skeleton className="h-8 w-[150px] mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Comments Section Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-[120px]" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-6">
            <div className="bg-card rounded-lg border p-6">
              {/* Provider Info */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Provider Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>

              {/* Contact Button */}
              <div className="mt-6">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}