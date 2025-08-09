import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Key, Bell, Globe, Shield } from "lucide-react";

const SettingsLayout = () => {
  const navigate = useNavigate();

  const settingsNav = [
    {
      to: "/settings/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      to: "/settings/security",
      label: "Password",
      icon: Key,
    },
    {
      to: "/settings/language",
      label: "Language",
      icon: Globe,
    },
    {
      to: "/settings/privacy",
      label: "Privacy",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Settings - PadelELO</title>
        <meta name="description" content="Manage your account settings, privacy preferences, and notifications on PadelELO." />
      </Helmet>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {settingsNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;