import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Key, Globe, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const sections = [
  { to: "/settings/notifications", label: "Notifications", description: "Manage alerts and WhatsApp updates", icon: Bell },
  { to: "/settings/security", label: "Password", description: "Change your password securely", icon: Key },
  { to: "/settings/language", label: "Language", description: "Set your language preferences", icon: Globe },
  { to: "/settings/privacy", label: "Privacy", description: "Control visibility and requests", icon: Shield },
];

export default function SettingsLanding() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Keep desktop flow unchanged: auto-redirect to default section
  useEffect(() => {
    if (!isMobile) {
      navigate("/settings/security", { replace: true });
    }
  }, [isMobile, navigate]);

  return (
    <div>
      <Helmet>
        <title>Settings – Choose a section | PadelELO</title>
        <meta name="description" content="Select a settings section: notifications, password, language, or privacy." />
        <link rel="canonical" href="/settings" />
      </Helmet>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ to, label, description, icon: Icon }) => (
          <Card key={to} className="transition-colors">
            <button
              type="button"
              onClick={() => navigate(to)}
              className="w-full text-left"
              aria-label={`Open ${label} settings`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {label}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Open</Button>
              </CardContent>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
