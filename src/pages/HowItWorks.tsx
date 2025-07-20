import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Link } from "react-router-dom";
import { BookOpen, Users, Shield, Clock, HelpCircle, CheckCircle, UserPlus, Trophy } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/home/Footer";

const HowItWorks = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use PadelELO - Mauritius Padel Community",
    "description": "Learn how to use PadelELO to track matches, build rankings, and connect with padel players in Mauritius",
    "url": "https://padel-elo.com/how-it-works"
  };

  return (
    <>
      <Helmet>
        <title>How It Works - PadelELO Guide for Mauritius Players</title>
        <meta 
          name="description" 
          content="Learn how to use PadelELO: track matches, build rankings, connect with friends, and improve your padel game in Mauritius. Complete guide for new players."
        />
        <meta name="keywords" content="padel guide mauritius, how to use padel elo, padel ranking system, MMR explained, padel community guide" />
        
        {/* Open Graph */}
        <meta property="og:title" content="How It Works - PadelELO Guide" />
        <meta property="og:description" content="Learn how to use PadelELO to track matches and build rankings in Mauritius" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://padel-elo.com/how-it-works" />
        <meta property="og:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="How It Works - PadelELO Guide" />
        <meta name="twitter:description" content="Learn how to use PadelELO for padel in Mauritius" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padel-elo.com/how-it-works" />
      </Helmet>
      <Navigation />
      <PageContainer>
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How PadelELO Works
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Master the platform with our comprehensive guide to tracking matches, building rankings, and connecting with the Mauritius padel community.
            </p>
          </div>

          {/* Main Rules Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Friends Only
                  <Badge variant="secondary" className="text-xs">Rule 1</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 leading-relaxed">
                  You can only register matches with your friends. Visit the leaderboard, find players, and send friend requests to start playing together.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Your Matches Only
                  <Badge variant="secondary" className="text-xs">Rule 2</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 leading-relaxed">
                  You can only register matches that you actually participated in. No third-party match reporting allowed.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Order Matters
                  <Badge variant="secondary" className="text-xs">Rule 3</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 leading-relaxed">
                  Register matches in the order you played them. MMR calculations are processed sequentially for accurate ratings.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Match Registration Process */}
          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">Registering a Match</CardTitle>
              </div>
              <p className="text-foreground/70">Follow these simple steps to record your match results</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Select Players</h3>
                    <p className="text-sm text-foreground/70">Choose the 3 other players who participated in your match from your friends list.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Choose Partner</h3>
                    <p className="text-sm text-foreground/70">Select your partner from the chosen players to form your team.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Add Score</h3>
                    <p className="text-sm text-foreground/70">Enter the final score for the set you played.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground/80">
                      <strong>Note:</strong> Each match currently represents one set. For best-of-3 matches, record each set separately. 
                      Winning 2-0 vs 2-1 will have different MMR impacts, helping us calibrate rankings more accurately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </div>
              <p className="text-foreground/70">Common questions about using PadelELO</p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-border">
                  <AccordionTrigger className="text-left">
                    Do other players need to confirm matches after I register them?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    No, PadelELO operates on an honor-based system. Match results are immediately recorded without requiring confirmation from other players.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-border">
                  <AccordionTrigger className="text-left">
                    Can I register fake matches to boost my rating?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    Technically yes, but it's not recommended. The MMR system is zero-sum (you only gain points by taking them from others), 
                    all matches are public, and you'll likely lose friends. Fair play keeps the community strong.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-border">
                  <AccordionTrigger className="text-left">
                    Can I revert a match I registered by mistake?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    Currently, matches cannot be reverted once registered. Double-check all details before submitting your match results.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-border">
                  <AccordionTrigger className="text-left">
                    How are MMR points calculated?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70">
                    Points are based on match difficulty. Playing against higher-rated opponents gives more points for wins and fewer point losses for defeats. 
                    See our <Link to="/matchmaking-math" className="text-primary hover:text-primary/80 underline font-medium">
                      Matchmaking Math
                    </Link> page for detailed calculations.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default HowItWorks;