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
            <p className="text-muted-foreground">
              Content coming soon...
            </p>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default HowItWorks;