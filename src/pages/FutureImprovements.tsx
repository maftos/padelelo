import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const FutureImprovements = () => {
  const [name, setName] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('suggestions').insert([
        { name, suggestion, user_id: (await supabase.auth.getUser()).data.user?.id }
      ]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your suggestion has been submitted successfully.",
      });

      setName("");
      setSuggestion("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Suggestion Form */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Mail className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Suggest Changes</h2>
            </div>
            <form onSubmit={handleSubmitSuggestion} className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              <Textarea
                placeholder="Your suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </form>
          </section>

          {/* Future Improvements List */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Planned Improvements</h2>
            
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-accent">
                <h3 className="text-lg font-semibold mb-2">Advanced Match Statistics</h3>
                <p className="text-muted-foreground">Detailed analytics and visualization of match history and performance metrics.</p>
                <p className="text-sm text-primary mt-2">Expected: Q2 2024</p>
              </div>

              <div className="p-6 rounded-lg bg-accent">
                <h3 className="text-lg font-semibold mb-2">Tournament System</h3>
                <p className="text-muted-foreground">Organize and participate in tournaments with automatic bracket generation.</p>
                <p className="text-sm text-primary mt-2">Expected: Q3 2024</p>
              </div>

              <div className="p-6 rounded-lg bg-accent">
                <h3 className="text-lg font-semibold mb-2">Mobile App</h3>
                <p className="text-muted-foreground">Native mobile application for iOS and Android.</p>
                <p className="text-sm text-primary mt-2">Expected: Q4 2024</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FutureImprovements;