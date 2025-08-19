
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import CreateBookingWizard from "@/components/create-match/CreateBookingWizard";

const CreateBooking = () => {
  return (
    <>
      <Navigation />
      <PageContainer>
        <CreateBookingWizard />
      </PageContainer>
    </>
  );
};

export default CreateBooking;
