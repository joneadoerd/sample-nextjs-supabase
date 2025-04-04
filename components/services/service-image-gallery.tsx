"use client";

import { Suspense, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ServiceImageGalleryProps {
  images: string[];
}

export function ServiceImageGallery({ images }: ServiceImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  // If no images, show placeholder
  if (images.length === 0) {
    images = ["/placeholder.svg?height=400&width=800"];
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="aspect-video relative">
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt="Service image"
            fill
            className="object-cover w-full h-full"
          />
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 hover:text-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 hover:text-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next image</span>
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
                onClick={() => setCurrentImage(index)}
              >
                <span className="sr-only">Image {index + 1}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {currentImage + 1} / {images.length}
      </div>
    </div>
  );
}
