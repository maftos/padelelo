import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquarePlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  court_quality: number;
  lighting: number;
  wind_protection: number;
  facilities: number;
  comment: string;
  created_at: string;
}

interface ReviewSectionProps {
  venueId: string;
  venueName: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ venueId, venueName }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      user_name: "Alex Rodriguez",
      user_avatar: "/src/assets/avatar-alex.jpg",
      rating: 5,
      court_quality: 5,
      lighting: 4,
      wind_protection: 5,
      facilities: 4,
      comment: "Excellent courts with great surface quality. The lighting is perfect for evening games and the wind protection makes it comfortable to play even on breezy days.",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "2", 
      user_name: "Maria Santos",
      user_avatar: "/src/assets/avatar-maria.jpg",
      rating: 4,
      court_quality: 4,
      lighting: 5,
      wind_protection: 3,
      facilities: 4,
      comment: "Great facility overall. The courts are well-maintained and the lighting system is top-notch. Could use better wind barriers on court 2, but otherwise very satisfied.",
      created_at: "2024-01-10T16:45:00Z"
    },
    {
      id: "3",
      user_name: "John Mitchell",
      user_avatar: "/src/assets/avatar-john.jpg", 
      rating: 5,
      court_quality: 5,
      lighting: 5,
      wind_protection: 4,
      facilities: 5,
      comment: "One of the best padel facilities in Mauritius! Professional-grade courts, excellent lighting for night games, and great amenities. Highly recommend!",
      created_at: "2024-01-08T14:20:00Z"
    }
  ]);

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    court_quality: 5,
    lighting: 5,
    wind_protection: 5,
    facilities: 5,
    comment: ""
  });

  const handleRatingChange = (category: string, rating: number) => {
    setNewReview(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmitReview = () => {
    // In a real app, this would submit to the backend
    console.log("Submitting review:", newReview);
    setIsReviewDialogOpen(false);
    // Reset form
    setNewReview({
      rating: 5,
      court_quality: 5,
      lighting: 5,
      wind_protection: 5,
      facilities: 5,
      comment: ""
    });
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const RatingStars = ({ rating, onRatingChange, readonly = true }: { rating: number, onRatingChange?: (rating: number) => void, readonly?: boolean }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${!readonly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => !readonly && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={Math.round(averageRating)} />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
              </span>
            </div>
          </div>
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Review {venueName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Overall Rating</Label>
                  <RatingStars 
                    rating={newReview.rating} 
                    onRatingChange={(rating) => handleRatingChange('rating', rating)}
                    readonly={false}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Court Quality</Label>
                    <RatingStars 
                      rating={newReview.court_quality} 
                      onRatingChange={(rating) => handleRatingChange('court_quality', rating)}
                      readonly={false}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Lighting</Label>
                    <RatingStars 
                      rating={newReview.lighting} 
                      onRatingChange={(rating) => handleRatingChange('lighting', rating)}
                      readonly={false}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Wind Protection</Label>
                    <RatingStars 
                      rating={newReview.wind_protection} 
                      onRatingChange={(rating) => handleRatingChange('wind_protection', rating)}
                      readonly={false}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Facilities</Label>
                    <RatingStars 
                      rating={newReview.facilities} 
                      onRatingChange={(rating) => handleRatingChange('facilities', rating)}
                      readonly={false}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Comment</Label>
                  <Textarea
                    placeholder="Share your experience at this padel court..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitReview}>
                    Submit Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user_avatar} alt={review.user_name} />
                <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <RatingStars rating={review.rating} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Court Quality:</span>
                    <RatingStars rating={review.court_quality} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lighting:</span>
                    <RatingStars rating={review.lighting} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Wind Protection:</span>
                    <RatingStars rating={review.wind_protection} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Facilities:</span>
                    <RatingStars rating={review.facilities} />
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};