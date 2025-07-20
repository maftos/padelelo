
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductShowcaseSection } from "@/components/home/ProductShowcaseSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { ELOSection } from "@/components/home/ELOSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { NewsSection } from "@/components/content/NewsSection";
import { CommunityTestimonials } from "@/components/content/CommunityTestimonials";

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PadelELO",
    "description": "Mauritius's premier padel community platform for tracking matches, rankings, and connecting players",
    "url": "https://padel-elo.com",
    "logo": "https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "MU",
      "addressLocality": "Mauritius"
    },
    "sameAs": [
      "https://facebook.com/padelelo",
      "https://instagram.com/padelelo"
    ],
    "areaServed": "Mauritius",
    "sport": "Padel"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>PadelELO - Mauritius Padel Rankings & Match Tracking Community</title>
        <meta 
          name="description" 
          content="Join Mauritius's leading padel community! Track matches, view rankings, find opponents, and improve your game with our advanced MMR system. Connect with 500+ active players."
        />
        <meta name="keywords" content="padel mauritius, padel rankings, padel matches, padel community, MMR ranking, padel courts mauritius" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PadelELO - Mauritius Padel Rankings & Community" />
        <meta property="og:description" content="Join Mauritius's leading padel community! Track matches, view rankings, and connect with 500+ active players." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://padel-elo.com" />
        <meta property="og:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        <meta property="og:locale" content="en_MU" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PadelELO - Mauritius Padel Rankings" />
        <meta name="twitter:description" content="Join Mauritius's leading padel community! Track matches and view rankings." />
        <meta name="twitter:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padel-elo.com" />
      </Helmet>
      <LocalBusinessSchema />
      <Navigation />
      <main className="space-y-0">
        <HeroSection />
        <ProductShowcaseSection />
        <CommunitySection />
        <NewsSection showFeatured={true} maxItems={2} title="Latest Community Updates" />
        <ELOSection />
        <CommunityTestimonials maxItems={4} />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
