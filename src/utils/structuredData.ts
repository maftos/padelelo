
// Organization structured data for PadelELO
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PadelELO",
  "description": "Mauritius Padel Rankings & Match Tracking Platform",
  "url": "https://padelelo.lovable.app",
  "logo": "https://padelelo.lovable.app/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "French"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MU",
    "addressRegion": "Mauritius"
  },
  "sameAs": [
    "https://padelelo.lovable.app"
  ]
});

// Local Business schema for padel courts
export const getLocalBusinessSchema = (courtData?: {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": courtData?.name || "Padel Courts in Mauritius",
  "description": "Professional padel courts in Mauritius for tournaments and recreational play",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MU",
    "addressRegion": "Mauritius",
    "streetAddress": courtData?.address || "Mauritius"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -20.348404,
    "longitude": 57.552152
  },
  "telephone": courtData?.phone,
  "url": courtData?.website || "https://padelelo.lovable.app/padel-courts",
  "sport": "Padel",
  "priceRange": "$$"
});

// Tournament/Sports Event schema
export const getTournamentSchema = (tournament: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  maxParticipants?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": tournament.name,
  "description": tournament.description,
  "startDate": tournament.startDate,
  "endDate": tournament.endDate,
  "location": {
    "@type": "Place",
    "name": tournament.venue || "Mauritius",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MU",
      "addressRegion": "Mauritius"
    }
  },
  "sport": "Padel",
  "eventStatus": "https://schema.org/EventScheduled",
  "maximumAttendeeCapacity": tournament.maxParticipants,
  "organizer": {
    "@type": "Organization",
    "name": "PadelELO"
  }
});

// Leaderboard/Competition schema
export const getLeaderboardSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "name": "PadelELO Mauritius Rankings",
  "description": "Official padel player rankings and leaderboard for Mauritius",
  "sport": "Padel",
  "location": {
    "@type": "Place",
    "name": "Mauritius",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MU"
    }
  },
  "url": "https://padelelo.lovable.app/leaderboard"
});

// WebSite schema with search functionality
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PadelELO",
  "description": "Mauritius Padel Rankings & Match Tracking",
  "url": "https://padelelo.lovable.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://padelelo.lovable.app/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});
