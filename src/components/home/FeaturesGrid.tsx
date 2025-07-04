
import { Link } from "react-router-dom";

export const FeaturesGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-16">
      <Link 
        to="/friends" 
        className="group relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300"
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Friends</h3>
            <p className="text-muted-foreground text-sm px-4">Connect with other players and build your network</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <Link 
        to="/leaderboard" 
        className="group relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300"
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0A3.42 3.42 0 007.835 4.697z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Leaderboard</h3>
            <p className="text-muted-foreground text-sm px-4">Track your progress and see your ranking</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <Link 
        to="/matches" 
        className="group relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300"
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-secondary/20 to-accent/30 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Match History</h3>
            <p className="text-muted-foreground text-sm px-4">Review your past matches and performance</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
    </div>
  );
};
