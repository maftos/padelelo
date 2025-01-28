import { MatchForm } from "@/components/MatchForm";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { PageHeader } from "@/components/match/PageHeader";

const RegisterMatch = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <PageHeader 
          title="Register Match" 
          description="Record your padel match results"
        />
        <MatchForm />
      </PageContainer>
    </>
  );
};

export default RegisterMatch;