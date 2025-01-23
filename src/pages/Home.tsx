import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Trophy, History, Calculator, Rocket, ClipboardList, Github } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <main className="container py-8 px-4 space-y-24">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="relative h-[500px] rounded-xl overflow-hidden mb-16 shadow-2xl">
            <img
              src="https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/ui-assets/home_banner.jpg"
              alt="Padel Court"
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-transparent flex items-center">
              <div className="p-8 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                  Elevate Your <span className="text-primary">Padel Game</span>
                </h1>
                <p className="text-lg md:text-xl text-foreground/80 mb-8">
                  Join Mauritius's premier padel community. Track your progress, connect with players, and compete at your level.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/register-match">Start Playing</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10">
                    <Link to="/leaderboard">View Rankings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-24">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Friends</h2>
              <p className="text-muted-foreground">
                Connect with fellow padel players, build your network, and find partners for your next match.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/friends">Find Friends →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Leaderboard</h2>
              <p className="text-muted-foreground">
                Access Mauritius's first ELO rating system for padel. Track your progress and compete with the best.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/leaderboard">View Rankings →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Match History</h2>
              <p className="text-muted-foreground">
                Review your match history, analyze your performance, and track your improvement over time.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/matches">View History →</Link>
              </Button>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-accent hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Smart Matching</h2>
              <p className="text-muted-foreground">
                Our ELO system ensures fair and competitive matches by pairing players of similar skill levels.
              </p>
              <Button asChild variant="link" className="p-0 text-primary">
                <Link to="/matchmaking-math">Learn More →</Link>
              </Button>
            </Card>
          </div>

          {/* Q&A Section */}
          <section className="mb-32 relative">
            <div className="absolute inset-0 bg-accent/50 rounded-2xl backdrop-blur-sm -z-10" />
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the ELO rating work?</AccordionTrigger>
                  <AccordionContent>
                    The ELO rating system calculates your skill level based on match outcomes and opponent ratings. 
                    Win against stronger players, gain more points. Lose against weaker players, lose more points. 
                    This creates a fair and competitive environment where everyone can find matches at their skill level.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How can I sign up?</AccordionTrigger>
                  <AccordionContent>
                    Simply click the "Sign In" button in the top right corner and create an account. 
                    Once registered, you can set up your profile, add friends, and start recording your matches. 
                    The process takes less than 2 minutes!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How much does it cost?</AccordionTrigger>
                  <AccordionContent>
                    PadelELO is completely free to use! We believe in making padel more accessible and enjoyable for everyone. 
                    All features, including match tracking, rankings, and friend connections, are available at no cost.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What's the big vision?</AccordionTrigger>
                  <AccordionContent>
                    We aim to create Mauritius's largest and most engaged padel community. Our vision includes 
                    organizing tournaments, facilitating player development, and making it easier for players 
                    to find partners and matches at their skill level. We're building the future of padel in Mauritius!
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          {/* Release Notes Section */}
          <section className="mb-32 relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-2xl backdrop-blur-sm -z-10" />
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <ClipboardList className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Latest Updates</h2>
              </div>
              <Card className="p-8 bg-card/50 backdrop-blur border-accent">
                <h3 className="text-xl font-semibold mb-4">Version 1.0.0 - Initial Release</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Launched PadelELO platform</li>
                  <li>Implemented basic matchmaking system</li>
                  <li>Added friend system</li>
                  <li>Introduced MMR calculations</li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-accent mt-24 bg-card/50 backdrop-blur-sm">
        <div className="container py-12 px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <p className="text-muted-foreground">
                PadelELO is Mauritius's premier platform for competitive padel players.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/register-match" className="text-muted-foreground hover:text-primary transition-colors">
                    Register Match
                  </Link>
                </li>
                <li>
                  <Link to="/friends" className="text-muted-foreground hover:text-primary transition-colors">
                    Find Friends
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/matchmaking-math" className="text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/future-improvements" className="text-muted-foreground hover:text-primary transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Connect</h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-accent mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 PadelELO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;