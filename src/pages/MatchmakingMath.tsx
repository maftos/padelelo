import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Target, BarChart3 } from "lucide-react";

const MatchmakingMath = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "name": "PadelELO Matchmaking Algorithm & MMR System",
    "description": "Detailed explanation of the ELO rating system used for padel matchmaking in Mauritius",
    "url": "https://padel-elo.com/matchmaking-math"
  };

  return (
    <>
      <Helmet>
        <title>Matchmaking Algorithm & MMR System - PadelELO</title>
        <meta 
          name="description" 
          content="Learn how PadelELO's MMR system works: ELO rating calculations, expected win rates, and how match results affect your ranking in Mauritius padel community."
        />
        <meta name="keywords" content="ELO rating system, MMR calculation, padel ranking algorithm, matchmaking math, tennis rating system" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Matchmaking Algorithm & MMR System - PadelELO" />
        <meta property="og:description" content="Learn how PadelELO's MMR and ELO rating system works for padel matchmaking" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://padel-elo.com/matchmaking-math" />
        <meta property="og:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Matchmaking Algorithm - PadelELO" />
        <meta name="twitter:description" content="Learn how ELO rating system works for padel" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padel-elo.com/matchmaking-math" />
      </Helmet>
      <Navigation />
      <PageContainer>
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Matchmaking Algorithm
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Understanding the mathematical foundations behind PadelELO's rating system and how your MMR is calculated.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* ELO System Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">ELO Rating System</CardTitle>
                </div>
                <p className="text-foreground/70">
                  Our matchmaking system is based on the ELO rating system, originally developed for chess by Arpad Elo. 
                  The system calculates expected win rates and adjusts ratings after each match based on the outcome 
                  and the relative skill difference between teams.
                </p>
              </CardHeader>
            </Card>

            {/* Expected Win Rate Formula */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Expected Win Rate</CardTitle>
                </div>
                <p className="text-sm text-foreground/70">
                  Calculates the probability of a team winning based on rating difference
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm font-medium text-foreground/80 mb-4">Expected Win Rate Formula:</p>
                    
                    {/* Mathematical Formula */}
                    <div className="font-mono text-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-primary font-semibold">E</span>
                        <span className="text-sm text-foreground/60 -mb-2">team1</span>
                        <span className="text-foreground/80">=</span>
                        
                        {/* Fraction */}
                        <div className="inline-flex flex-col items-center">
                          <div className="text-primary font-semibold border-b border-foreground/40 pb-1 px-4">
                            1
                          </div>
                          <div className="text-foreground/80 pt-1 text-base">
                            1 + 10<sup className="text-sm text-foreground/60">
                              (R<sub className="text-xs">team2</sub> - R<sub className="text-xs">team1</sub>)/1500
                            </sup>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-foreground/60 space-y-1 mt-4">
                      <p><strong>Where:</strong></p>
                      <p>• R<sub>team1</sub>, R<sub>team2</sub> = Average team ratings</p>
                      <p>• 1500 = Rating scale factor</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MMR Adjustment Formula */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Rating Adjustment</CardTitle>
                </div>
                <p className="text-sm text-foreground/70">
                  How ratings change after each match result
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm font-medium text-foreground/80 mb-4">New Rating Formula:</p>
                    
                    <div className="font-mono text-lg">
                      <div className="flex items-center justify-center flex-wrap gap-2">
                        <span className="text-primary font-semibold">R<sub className="text-sm">new</sub></span>
                        <span className="text-foreground/80">=</span>
                        <span className="text-foreground/80">R<sub className="text-sm">old</sub></span>
                        <span className="text-foreground/80">+</span>
                        <span className="text-primary font-semibold">K</span>
                        <span className="text-foreground/80">×</span>
                        <span className="text-foreground/80">(S - E)</span>
                      </div>
                    </div>

                    <div className="text-xs text-foreground/60 space-y-1 mt-4">
                      <p><strong>Where:</strong></p>
                      <p>• K = 50 (adjustment factor)</p>
                      <p>• S = Actual score (1 for win, 0 for loss)</p>
                      <p>• E = Expected win rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example Calculation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                Example Calculation
              </CardTitle>
              <p className="text-foreground/70">
                Let's walk through a practical example of how MMR changes are calculated
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-semibold mb-2 text-foreground">Scenario: Even Match</h4>
                    <div className="space-y-2 text-sm text-foreground/80">
                      <p>• Team A average MMR: 1500</p>
                      <p>• Team B average MMR: 1500</p>
                      <p>• Rating difference: 0</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <h4 className="font-semibold mb-2 text-foreground">Expected Win Rate</h4>
                    <div className="text-sm text-foreground/80">
                      <p>E = 1 / (1 + 10<sup>0/1500</sup>) = 1 / (1 + 1) = <strong>0.5 (50%)</strong></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-semibold mb-2 text-foreground">If Team A Wins</h4>
                    <div className="space-y-1 text-sm text-foreground/80">
                      <p>MMR Change = 50 × (1 - 0.5) = <strong>+25 points</strong></p>
                      <p>Team A: 1500 → 1525</p>
                      <p>Team B: 1500 → 1475</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-semibold mb-2 text-foreground">Key Insights</h4>
                    <div className="space-y-1 text-sm text-foreground/80">
                      <p>• Upsets yield larger point swings</p>
                      <p>• Expected wins yield smaller changes</p>
                      <p>• System maintains zero-sum balance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Pro Tip</Badge>
                  Upset Victories
                </h4>
                <p className="text-sm text-foreground/80">
                  When a lower-rated team (e.g., 1300 MMR) defeats a higher-rated team (e.g., 1700 MMR), 
                  the expected win rate might be only 0.09 (9%). The MMR change would be: 50 × (1 - 0.09) = 
                  <strong>+45 points</strong> for the underdogs, creating dramatic ranking shifts that reward skill over rating.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default MatchmakingMath;