"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ServiceWithRelations } from "@/prisma/types";
import Image from "next/image";

interface ServiceCardProps {
  service: ServiceWithRelations;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const images =
    service.images?.length > 0
      ? service.images
      : [
          {
            url: "/placeholder.svg?height=200&width=400",
          },
        ];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link href={`/services/${service.id}`} className="block h-full">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={images[currentImage]?.url || "/placeholder.svg"}
            alt={service.name}
            fill
            className="object-cover w-full h-full transition-transform duration-500"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full p-1"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 hover:text-white rounded-full p-1"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImage(index);
                    }}
                  >
                    <span className="sr-only">Image {index + 1}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            {/* <p className="text-white font-semibold text-lg">${service.price.toFixed(2)}</p> */}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{service.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {service.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage alt={service.user.name} />
              <AvatarFallback>
                {service.user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{service.user.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(service.date), { addSuffix: true })}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
