import { Helmet } from "react-helmet";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
  title?: string;
}

export const FAQStructuredData = ({ 
  faqs, 
  title = "Frequently Asked Questions - PadelELO" 
}: FAQStructuredDataProps) => {
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": title,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};