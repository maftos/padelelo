import React, { useState } from "react";
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
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="grid grid-cols-4 gap-2 h-[400px] rounded-xl overflow-hidden">
        {/* Main large image - takes up 2 columns */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div 
              className="col-span-2 relative cursor-pointer group h-full"
              onClick={() => {
                setCurrentImageIndex(0);
                setIsDialogOpen(true);
              }}
            >
              <img 
                src={galleryPhotos[0]} 
                alt={`${venueName} - Main Photo`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </DialogTrigger>

          {/* Grid of 4 smaller images on the right */}
          <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
            {galleryPhotos.slice(1, 5).map((photo, index) => (
              <Dialog key={index + 1} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="relative cursor-pointer group h-full overflow-hidden"
                    onClick={() => {
                      setCurrentImageIndex(index + 1);
                      setIsDialogOpen(true);
                    }}
                  >
                    <img 
                      src={photo} 
                      alt={`${venueName} - Photo ${index + 2}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* "Show all photos" button on the last image */}
                    {index === 3 && galleryPhotos.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Show all photos
                        </div>
                      </div>
                    )}
                  </div>
                </DialogTrigger>
              </Dialog>
            ))}
          </div>

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
      </div>
    </div>
  );
};