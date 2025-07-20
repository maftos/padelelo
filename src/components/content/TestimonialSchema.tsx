import { Helmet } from "react-helmet";

interface Testimonial {
  author: string;
  rating: number;
  text: string;
  date?: string;
  title?: string;
  location?: string;
}

interface TestimonialSchemaProps {
  testimonials: Testimonial[];
  businessName?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export const TestimonialSchema = ({
  testimonials,
  businessName = "PadelELO",
  aggregateRating
}: TestimonialSchemaProps) => {
  
  const reviews = testimonials.map(testimonial => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": testimonial.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": testimonial.rating,
      "bestRating": 5
    },
    "reviewBody": testimonial.text,
    "datePublished": testimonial.date || new Date().toISOString().split('T')[0]
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessName,
    "review": reviews,
    ...(aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": 5
      }
    })
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};