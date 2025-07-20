import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { NewsSection } from "@/components/content/NewsSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SocialShare } from "@/components/seo/SocialShare";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, TrendingUp, Users, Trophy } from "lucide-react";

const News = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PadelELO News & Updates",
    "description": "Latest news, updates, and announcements from the Mauritius padel community",
    "url": "https://padel-elo.com/news",
    "publisher": {
      "@type": "Organization",
      "name": "PadelELO",
      "logo": "https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png"
    }
  };

  const stats = [
    {
      icon: Users,
      label: "Active Players",
      value: "500+",
      description: "Growing community"
    },
    {
      icon: Trophy,
      label: "Tournaments",
      value: "25+",
      description: "Hosted this year"
    },
    {
      icon: TrendingUp,
      label: "Matches Played",
      value: "2,000+",
      description: "Total matches tracked"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>News & Updates - PadelELO Mauritius Community</title>
        <meta 
          name="description" 
          content="Stay updated with the latest news from the Mauritius padel community. Tournament announcements, feature updates, community milestones, and more from PadelELO."
        />
        <meta name="keywords" content="padel news mauritius, tournament announcements, community updates, padel events, PadelELO updates" />
        
        {/* Open Graph */}
        <meta property="og:title" content="News & Updates - PadelELO Mauritius" />
        <meta property="og:description" content="Latest news and updates from the Mauritius padel community" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://padel-elo.com/news" />
        <meta property="og:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="News & Updates - PadelELO" />
        <meta name="twitter:description" content="Latest news from Mauritius padel community" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padel-elo.com/news" />
      </Helmet>
      
      <Navigation />
      
      <PageContainer>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold">Community News & Updates</h1>
              <div className="ml-4">
                <SocialShare
                  title="PadelELO Community News & Updates"
                  description="Stay updated with the latest from the Mauritius padel community"
                  hashtags={["padel", "mauritius", "news", "community"]}
                  showZapierIntegration={true}
                />
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest developments in Mauritius's growing padel community. 
              From tournament announcements to feature updates and community milestones.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-medium text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* News Articles */}
          <NewsSection maxItems={6} title="Latest Updates" />

          {/* Community Highlights */}
          <section className="mt-16 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Community Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Tournament Season
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our biggest tournament season yet is underway! Join competitions across 
                    all skill levels and venues throughout Mauritius.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Growing Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Welcome to all our new members! The padel community in Mauritius 
                    continues to grow with players of all skill levels joining daily.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Newsletter Signup */}
          <Card className="max-w-2xl mx-auto text-center bg-secondary/20">
            <CardHeader>
              <CardTitle>Stay in the Loop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get notified about new tournaments, community events, and platform updates.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Follow us for updates or connect your favorite apps with Zapier</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default News;