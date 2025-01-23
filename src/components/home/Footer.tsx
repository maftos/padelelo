import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-accent bg-card/50 backdrop-blur-sm">
      <div className="container py-12 px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <p className="text-muted-foreground">
              PadelELO is Mauritius's premier platform for competitive padel players.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/register-match" className="text-muted-foreground hover:text-primary transition-colors">
                  Register Match
                </Link>
              </li>
              <li>
                <Link to="/friends" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Friends
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/matchmaking-math" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/future-improvements" className="text-muted-foreground hover:text-primary transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-accent mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2024 PadelELO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};