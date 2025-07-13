
import { Helmet } from "react-helmet";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  keywords?: string;
  author?: string;
}

export const SEOHead = ({
  title = "PadelELO - Mauritius Padel Rankings & Match Tracking",
  description = "Track your padel matches, view rankings, and connect with other players in Mauritius. PadelELO helps you improve your game with our advanced MMR system.",
  canonicalUrl,
  ogImage = "/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png",
  ogType = "website",
  structuredData,
  keywords = "padel, mauritius, rankings, match tracking, MMR, tournaments, courts",
  author = "PadelELO"
}: SEOHeadProps) => {
  const fullCanonicalUrl = canonicalUrl ? `https://padelelo.lovable.app${canonicalUrl}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `https://padelelo.lovable.app${ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:type" content={ogType} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:site_name" content="PadelELO" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Location-specific meta tags for Mauritius */}
      <meta name="geo.region" content="MU" />
      <meta name="geo.country" content="Mauritius" />
      <meta name="geo.placename" content="Mauritius" />
      <meta name="ICBM" content="-20.348404, 57.552152" />
      
      {/* Hreflang for potential multilingual support */}
      <link rel="alternate" hrefLang="en" href={fullCanonicalUrl || "https://padelelo.lovable.app"} />
      <link rel="alternate" hrefLang="fr" href={fullCanonicalUrl || "https://padelelo.lovable.app"} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
