
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-accent bg-card/50 backdrop-blur-sm">
      <div className="container py-12 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <p className="text-muted-foreground">
              PadelELO is Mauritius's premier platform for competitive padel players.
            </p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                For collaboration ideas, contact us at:{" "}
                <a href="mailto:matt.tmk@gmail.com" className="text-primary hover:underline">
                  matt.tmk@gmail.com
                </a>
                {" "}or WhatsApp:{" "}
                <a href="https://wa.me/23057935344" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  +230 5793 5344
                </a>
              </p>
            </div>
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
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/matchmaking-math" className="text-muted-foreground hover:text-primary transition-colors">
                  Matchmaking Algorithm
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-muted-foreground hover:text-primary transition-colors">
                  Feature Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2024 PadelELO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
