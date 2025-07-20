import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { TestimonialSchema } from "./TestimonialSchema";

interface TestimonialProps {
  author: string;
  rating: number;
  text: string;
  date?: string;
  title?: string;
  location?: string;
  avatar?: string;
}

const testimonials: TestimonialProps[] = [
  {
    author: "Alex Rodriguez",
    rating: 5,
    text: "PadelELO has completely transformed how I play padel in Mauritius. The ranking system is fair and the community is amazing. I've made so many new friends through the platform!",
    date: "2024-01-15",
    location: "Port Louis",
    avatar: "/src/assets/avatar-alex.jpg"
  },
  {
    author: "Sarah Chen", 
    rating: 5,
    text: "Finding good opponents used to be a challenge. Now with PadelELO's matchmaking system, I always have competitive matches. The tournament organization feature is fantastic too.",
    date: "2024-01-10",
    location: "Ebene",
    avatar: "/src/assets/avatar-sarah.jpg"
  },
  {
    author: "Marco Silva",
    rating: 5,
    text: "As a padel coach, I recommend PadelELO to all my students. It helps them track their progress and find playing partners at their skill level. The MMR system is very accurate.",
    date: "2024-01-08",
    location: "Grand Baie",
    avatar: "/src/assets/avatar-mike.jpg"
  },
  {
    author: "Maria Dubois",
    rating: 5,
    text: "The best part about PadelELO is how it brings the padel community together. I love seeing everyone's progress and the friendly competition it creates.",
    date: "2024-01-05",
    location: "Quatre Bornes",
    avatar: "/src/assets/avatar-maria.jpg"
  }
];

interface CommunityTestimonialsProps {
  showSchema?: boolean;
  maxItems?: number;
  title?: string;
}

export const CommunityTestimonials = ({
  showSchema = true,
  maxItems = 4,
  title = "What Our Community Says"
}: CommunityTestimonialsProps) => {
  
  const displayedTestimonials = testimonials.slice(0, maxItems);
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section className="py-12 sm:py-16 md:py-24">
      {showSchema && (
        <TestimonialSchema 
          testimonials={testimonials}
          aggregateRating={{
            ratingValue: averageRating,
            reviewCount: testimonials.length
          }}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
            Join hundreds of padel players who've found their community through PadelELO
          </p>
          
          {/* Aggregate Rating Display */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {averageRating.toFixed(1)} out of 5 ({testimonials.length} reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {displayedTestimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Quote className="h-8 w-8 text-primary/20 flex-shrink-0 mt-1" />
                  
                  <div className="flex-1">
                    <p className="text-foreground/80 mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>
                            {testimonial.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {testimonial.author}
                          </p>
                          {testimonial.location && (
                            <p className="text-xs text-muted-foreground">
                              {testimonial.location}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= testimonial.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};