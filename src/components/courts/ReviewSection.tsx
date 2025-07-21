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
  nationality: string;
  play_time: string;
  court_number?: number;
  rank_summary: string;
  is_anonymous: boolean;
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
      created_at: "2024-01-15T10:30:00Z",
      nationality: "MX",
      play_time: "Evening",
      court_number: 1,
      rank_summary: "Top 25",
      is_anonymous: false
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
      created_at: "2024-01-10T16:45:00Z",
      nationality: "BR",
      play_time: "Afternoon",
      court_number: 2,
      rank_summary: "Top 100",
      is_anonymous: false
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
      created_at: "2024-01-08T14:20:00Z",
      nationality: "GB",
      play_time: "Night",
      rank_summary: "Top 10",
      is_anonymous: true
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

  const RatingBar = ({ category, rating, maxRating = 5 }: { category: string, rating: number, maxRating?: number }) => {
    const percentage = (rating / maxRating) * 100;
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground min-w-0 flex-1">{category}</span>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium min-w-8 text-right">{rating}</span>
        </div>
      </div>
    );
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      MX: "🇲🇽", BR: "🇧🇷", GB: "🇬🇧", FR: "🇫🇷", ES: "🇪🇸", 
      IT: "🇮🇹", DE: "🇩🇪", US: "🇺🇸", CA: "🇨🇦", AU: "🇦🇺",
      MU: "🇲🇺", IN: "🇮🇳", ZA: "🇿🇦"
    };
    return flags[countryCode] || "🏳️";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                Reviews
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-primary" />
                  <span className="font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-sm">({reviews.length})</span>
                </div>
              </CardTitle>
            </div>
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <CardContent className="p-4 md:p-6 space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={review.is_anonymous ? undefined : review.user_avatar} 
                    alt={review.is_anonymous ? "Anonymous User" : review.user_name}
                    className={review.is_anonymous ? "blur-sm" : ""}
                  />
                  <AvatarFallback className={review.is_anonymous ? "blur-sm" : ""}>
                    {review.is_anonymous ? "?" : review.user_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Country flag */}
                <div className="absolute -bottom-1 -right-1 text-lg">
                  {getCountryFlag(review.nationality)}
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className={`font-medium ${review.is_anonymous ? "blur-sm" : ""}`}>
                        {review.is_anonymous ? "Anonymous Player" : review.user_name}
                      </p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium w-fit">
                        {review.rank_summary}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <span>Played: {review.play_time}</span>
                      {review.court_number && (
                        <span>Court {review.court_number}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <RatingBar category="Court Quality" rating={review.court_quality} />
                  <RatingBar category="Lighting" rating={review.lighting} />
                  <RatingBar category="Wind Protection" rating={review.wind_protection} />
                  <RatingBar category="Facilities" rating={review.facilities} />
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