import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";

const HowItWorks = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">How It Works</h1>
          <div className="space-y-8">
            <section>
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
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default HowItWorks;