import { Helmet } from "react-helmet";
import { PageContainer } from "@/components/layouts/PageContainer";

const Privacy = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>Privacy Policy | PadelELO</title>
        <meta name="description" content="Learn how PadelELO protects your privacy and handles your personal data on our padel community platform." />
        <link rel="canonical" href="https://padel-elo.com/privacy" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              At PadelELO ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our padel community platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Name and email address</li>
              <li>Phone number (optional)</li>
              <li>Profile picture (optional)</li>
              <li>Date of birth and gender</li>
              <li>Padel skill level and experience</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-foreground mb-3">Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We automatically collect information about how you use our platform:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Match results and game statistics</li>
              <li>Login times and frequency of use</li>
              <li>Device information and IP address</li>
              <li>Location data (when you choose to share it)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use your personal information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Provide and maintain our service</li>
              <li>Calculate your padel rankings and statistics</li>
              <li>Connect you with other players</li>
              <li>Send you notifications about matches and updates</li>
              <li>Improve our platform and user experience</li>
              <li>Ensure the security and integrity of our service</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>With other users as part of your public profile (name, ranking, statistics)</li>
              <li>With service providers who help us operate our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Location Data</h2>
            <p className="text-muted-foreground mb-4">
              We may collect location data to help you find nearby courts and players. This data is collected only with your explicit consent and can be disabled at any time in your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Match data may be retained longer for historical rankings and statistics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on our platform and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at privacy@padel-elo.com.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default Privacy;