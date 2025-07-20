import { Helmet } from "react-helmet";

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude?: number;
    longitude?: number;
  };
  telephone?: string;
  email?: string;
  url?: string;
  openingHours?: string[];
  priceRange?: string;
}

export const LocalBusinessSchema = ({
  name = "PadelELO Mauritius",
  description = "Mauritius's premier padel community platform for tracking matches, rankings, and connecting players",
  address = {
    addressLocality: "Port Louis",
    addressRegion: "Port Louis District", 
    addressCountry: "MU"
  },
  geo = {
    latitude: -20.1619,
    longitude: 57.5012
  },
  url = "https://padel-elo.com",
  openingHours = [
    "Mo-Su 00:00-23:59"
  ],
  priceRange = "Free"
}: LocalBusinessSchemaProps) => {
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": name,
    "description": description,
    "url": url,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    },
    "openingHoursSpecification": openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "opens": "00:00",
      "closes": "23:59",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
      ]
    })),
    "priceRange": priceRange,
    "sport": "Padel",
    "areaServed": {
      "@type": "Country",
      "name": "Mauritius"
    },
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Padel Players"
    },
    "knowsAbout": [
      "Padel", "Tennis", "Racquet Sports", "Sports Rankings", 
      "Match Making", "Tournament Organization"
    ],
    "sameAs": [
      "https://facebook.com/padelelo",
      "https://instagram.com/padelelo"
    ]
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};