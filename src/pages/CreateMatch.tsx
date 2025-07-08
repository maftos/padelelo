
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import CreateBookingWizard from "@/components/create-match/CreateBookingWizard";

const CreateMatch = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <CreateBookingWizard />
      </PageContainer>
    </>
  );
};

export default CreateMatch;
