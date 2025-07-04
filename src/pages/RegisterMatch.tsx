
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

const RegisterMatch = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Register Match</CardTitle>
              <CardDescription className="text-base">
                Record your padel match results and update your rating
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Main Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Match Details</CardTitle>
              </div>
              <CardDescription>
                Select the players and enter the match results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchForm />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default RegisterMatch;
