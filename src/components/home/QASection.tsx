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
            <AccordionTrigger>How can I join PadelELO?</AccordionTrigger>
            <AccordionContent>
              PadelELO is currently an invite-only platform. To join, you need to be referred by an existing member. 
              You can view our current members on the leaderboard and get in touch with them directly to request an invitation.
              This helps us maintain a high-quality, engaged community of padel enthusiasts.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How does the ELO rating work?</AccordionTrigger>
            <AccordionContent>
              The ELO rating system calculates your skill level based on match outcomes and opponent ratings. 
              Win against stronger players, gain more points. Lose against weaker players, lose more points. 
              This creates a fair and competitive environment where everyone can find matches at their skill level.
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
            <AccordionTrigger>What's coming next?</AccordionTrigger>
            <AccordionContent>
              We're working on exciting features including a tournament management system that will help minimize waiting times 
              between games by providing transparent brackets and scheduling. We're also planning to integrate court booking 
              in Mauritius and connect players with professional padel coaches for personalized lessons.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};