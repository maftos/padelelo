
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
              PadelELO is currently an invite-only platform. To join, you need to be referred by an existing member 
              (see the leaderboard - and request an invitation).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How much does it cost?</AccordionTrigger>
            <AccordionContent>
              PadelELO is completely free to use! We believe in making padel more accessible and enjoyable for everyone. 
              All features, including match tracking, rankings, and friend connections, are available at no cost.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What's the big vision?</AccordionTrigger>
            <AccordionContent>
              We want to build an entire ecosystem around padel - starting in Mauritius. Think big - tournaments, coaches, 
              court bookings, a social network, padel retreats, and more. You dream it, we build it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
