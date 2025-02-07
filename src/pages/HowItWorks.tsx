import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">How It Works</h1>
          </div>

          <div className="space-y-8">
            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">General Rules</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Rule 1 - You can only register matches with your 'Friends'</h3>
                  <p className="text-muted-foreground">
                    To add your friends, go to the 'Leaderboard' and click on their profile. 
                    Send them a friend request, and once they confirm, you will be able to 
                    register matches for each other.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Rule 2 - You can only register your own matches</h3>
                  <p className="text-muted-foreground">
                    When you register a match, we assume you're in it.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Rule 3 - Make sure you record your sets in the right order</h3>
                  <p className="text-muted-foreground">
                    MMR (matchmaking rating) changes are calculated and adjusted after each set. 
                    So if you start an even matchup, a loss followed by a win will net you more points.
                  </p>
                </div>
              </div>
            </section>

            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">Registering a Match</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Step 1 - Select the 3 other players</h3>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Step 2 - Select your partner</h3>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Step 3 - Add the final score</h3>
                </div>
                <p className="text-muted-foreground mt-4">
                  Note - Currently a 'match' can only have one set. So if you play multiple sets, 
                  you will need to record them separately. This also means that in a typical best of 3, 
                  whether you win 2-0 or 2-1 will have a different impact on your mmr change - this helps 
                  us calibrate players to their true rank faster.
                </p>
              </div>
            </section>

            <section className="p-6 rounded-lg bg-accent">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Do the other players need to confirm the match after I register it?</AccordionTrigger>
                  <AccordionContent>
                    No, the match registration process on padelELO is honor-based. There's no confirmation needed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Wait, does that mean I can register fake matches & steal points from my friends?</AccordionTrigger>
                  <AccordionContent>
                    Yes. The MMR system is zero sum, so - you can only increase your rating by taking them from other players. 
                    Couple of things here - (a) not sure if they'll be your friends much longer, (b) all matches are public - 
                    so everyone will know.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>I registered a match by mistake, can I revert it?</AccordionTrigger>
                  <AccordionContent>
                    No.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How are the points won/loss calculated?</AccordionTrigger>
                  <AccordionContent>
                    Basically the harder your matchup (playing against opponents with higher MMR), the more points you win if you lose. 
                    This also means that if you lose a hard matchup, you would lose less points. See{' '}
                    <Link to="/matchmaking-math" className="underline hover:text-primary">
                      Matchmaking Math
                    </Link>{' '}
                    for full details.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default HowItWorks;