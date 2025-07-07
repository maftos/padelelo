
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

const ManageMatches = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Match Management</h1>
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground">
            Manage your pending matches and create new ones
          </p>

          {/* Main Form */}
          <Card>
            <CardContent className="p-6">
              <MatchForm />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default ManageMatches;
