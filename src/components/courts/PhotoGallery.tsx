import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoGalleryProps {
  photos: string[];
  venueName: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, venueName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample photos if none provided
  const galleryPhotos = photos.length > 0 ? photos : [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Photo Gallery</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryPhotos.slice(0, 4).map((photo, index) => (
            <Dialog key={index} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsDialogOpen(true);
                  }}
                >
                  <img 
                    src={photo} 
                    alt={`${venueName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                  {index === 3 && galleryPhotos.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold">+{galleryPhotos.length - 4} more</span>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <img 
                    src={galleryPhotos[currentImageIndex]} 
                    alt={`${venueName} - Photo ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {galleryPhotos.length}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};