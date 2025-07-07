
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import CreateMatchWizard from "@/components/create-match/CreateMatchWizard";

const CreateMatch = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <CreateMatchWizard />
      </PageContainer>
    </>
  );
};

export default CreateMatch;
