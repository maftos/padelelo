import { Helmet } from "react-helmet";
import { PageContainer } from "@/components/layouts/PageContainer";

const Terms = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>Terms of Service | PadelELO</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and guidelines for using PadelELO's padel community platform." />
        <link rel="canonical" href="https://padel-elo.com/terms" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="space-y-12">
          <div className="bg-muted/30 rounded-lg p-6 border">
            <p className="text-muted-foreground">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">1.1.</span> By accessing and using PadelELO ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">1.2.</span> If you do not agree to abide by these terms, please do not use this service.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              2. Description of Service
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">2.1.</span> PadelELO is a platform that connects padel players in Mauritius, allowing them to track matches, view rankings, find opponents, and discover padel courts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">2.2.</span> Our service includes match tracking, MMR (Match Making Rating) calculations, player profiles, and court directory features.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              3. User Accounts
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">3.1.</span> To access certain features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">3.2.</span> You must provide accurate and complete information during registration.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">3.3.</span> You are responsible for keeping your account information up to date.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">3.4.</span> You must not share your account credentials with others.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">3.5.</span> You must notify us immediately of any unauthorized use of your account.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              4. User Conduct
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.1.</span> You agree to use our service responsibly and in accordance with these terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.2.</span> You must not provide false information about match results.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.3.</span> You must not harass, threaten, or intimidate other users.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.4.</span> You must not upload inappropriate content or images.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.5.</span> You must not attempt to manipulate rankings or ratings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.6.</span> You must not use the service for any illegal purposes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">4.7.</span> You must not interfere with the security or functionality of the platform.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              5. Match Results and Rankings
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">5.1.</span> Our platform calculates player rankings based on match results submitted by users.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">5.2.</span> While we strive for accuracy, we cannot guarantee the correctness of all submitted data.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">5.3.</span> Users are responsible for submitting accurate match results.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              6. Privacy and Data Protection
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">6.1.</span> Your privacy is important to us.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">6.2.</span> Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              7. Intellectual Property
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">7.1.</span> All content and materials on PadelELO, including but not limited to text, graphics, logos, and software, are the property of PadelELO or its licensors.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">7.2.</span> All intellectual property is protected by copyright and other intellectual property laws.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              8. Disclaimers and Limitation of Liability
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">8.1.</span> PadelELO is provided "as is" without warranties of any kind.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">8.2.</span> We do not guarantee the accuracy, completeness, or availability of the service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">8.3.</span> To the fullest extent permitted by law, we disclaim all liability for any damages arising from your use of our platform.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              9. Modifications to Terms
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">9.1.</span> We reserve the right to modify these terms at any time.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">9.2.</span> Changes will be effective immediately upon posting.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">9.3.</span> Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              10. Termination
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">10.1.</span> We may terminate or suspend your account at any time for violations of these terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">10.2.</span> You may also terminate your account at any time by contacting us.
              </p>
            </div>
          </section>

          <section className="bg-background border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-3">
              11. Contact Information
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">11.1.</span> If you have any questions about these Terms of Service, please contact us at support@padel-elo.com.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Terms;