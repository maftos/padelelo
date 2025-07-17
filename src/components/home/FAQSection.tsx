import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can I join PadelELO?",
    answer: "Simply click 'Start Playing' to create your account and join our padel community. You can sign up with your WhatsApp number and start tracking your matches right away."
  },
  {
    question: "How much does it cost?",
    answer: "PadelELO is completely free to use! We believe in making padel more accessible and enjoyable for everyone. All features, including match tracking, rankings, and friend connections, are available at no cost."
  },
  {
    question: "How does the ELO rating system work?",
    answer: "Our ELO system rates your skill level based on match results and the skill level of your opponents. When you win against higher-rated players, you gain more points. This ensures fair matchmaking and accurate skill assessment."
  },
  {
    question: "Can I find courts and book matches?",
    answer: "Yes! PadelELO helps you discover courts across Mauritius and connect with other players. You can organize matches, join open games, and even participate in tournaments."
  },
  {
    question: "What's the vision for PadelELO?",
    answer: "We want to build a complete padel ecosystem in Mauritius - tournaments, coaching, court bookings, social networking, padel retreats, and more. Our goal is to grow the sport and create lasting connections within the community."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-secondary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-foreground/70">
            Everything you need to know about PadelELO
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full space-y-2 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors px-2 sm:px-0">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pt-2 px-2 sm:px-0 text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};