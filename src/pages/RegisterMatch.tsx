
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

const RegisterMatch = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Match Management</CardTitle>
              </div>
              <CardDescription>
                Manage your pending matches and add results
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
