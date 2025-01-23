import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const QASection = () => {
  return (
    <section className="mb-16 relative">
      <div className="absolute inset-0 bg-accent/50 rounded-2xl backdrop-blur-sm -z-10" />
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does the ELO rating work?</AccordionTrigger>
            <AccordionContent>
              The ELO rating system calculates your skill level based on match outcomes and opponent ratings. 
              Win against stronger players, gain more points. Lose against weaker players, lose more points. 
              This creates a fair and competitive environment where everyone can find matches at their skill level.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How can I sign up?</AccordionTrigger>
            <AccordionContent>
              Simply click the "Sign In" button in the top right corner and create an account. 
              Once registered, you can set up your profile, add friends, and start recording your matches. 
              The process takes less than 2 minutes!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>How much does it cost?</AccordionTrigger>
            <AccordionContent>
              PadelELO is completely free to use! We believe in making padel more accessible and enjoyable for everyone. 
              All features, including match tracking, rankings, and friend connections, are available at no cost.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>What's the big vision?</AccordionTrigger>
            <AccordionContent>
              We aim to create Mauritius's largest and most engaged padel community. Our vision includes 
              organizing tournaments, facilitating player development, and making it easier for players 
              to find partners and matches at their skill level. We're building the future of padel in Mauritius!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};