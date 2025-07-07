
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import EditMatchWizard from "@/components/edit-match/EditMatchWizard";

const EditMatch = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <EditMatchWizard />
      </PageContainer>
    </>
  );
};

export default EditMatch;
