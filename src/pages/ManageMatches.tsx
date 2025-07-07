
import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";

const ManageMatches = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              My Matches
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your pending matches and create new ones
            </p>
          </div>

          {/* Main Content */}
          <MatchForm />
        </div>
      </PageContainer>
    </>
  );
};

export default ManageMatches;
