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
        
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using PadelELO ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              PadelELO is a platform that connects padel players in Mauritius, allowing them to track matches, view rankings, find opponents, and discover padel courts. Our service includes match tracking, MMR (Match Making Rating) calculations, player profiles, and court directory features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              To access certain features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for keeping your account information up to date</li>
              <li>You must not share your account credentials with others</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              You agree to use our service responsibly and in accordance with these terms. Prohibited activities include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Providing false information about match results</li>
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Uploading inappropriate content or images</li>
              <li>Attempting to manipulate rankings or ratings</li>
              <li>Using the service for any illegal purposes</li>
              <li>Interfering with the security or functionality of the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Match Results and Rankings</h2>
            <p className="text-muted-foreground mb-4">
              Our platform calculates player rankings based on match results submitted by users. While we strive for accuracy, we cannot guarantee the correctness of all submitted data. Users are responsible for submitting accurate match results.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Privacy and Data Protection</h2>
            <p className="text-muted-foreground mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content and materials on PadelELO, including but not limited to text, graphics, logos, and software, are the property of PadelELO or its licensors and are protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Disclaimers and Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              PadelELO is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or availability of the service. To the fullest extent permitted by law, we disclaim all liability for any damages arising from your use of our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modifications to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account at any time for violations of these terms. You may also terminate your account at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at support@padel-elo.com.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Terms;