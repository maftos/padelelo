
import * as React from "react";
import { Helmet } from "react-helmet";

import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useLeaderboardFilters } from "@/hooks/use-leaderboard-filters";
import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";



const Leaderboard = () => {
  const { user } = useAuth();
  const { userId } = useUserProfile();
  const { filters, handleGenderChange, handleFriendsOnlyChange } = useLeaderboardFilters();
  const { data: leaderboardData, isLoading } = useLeaderboardData();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handlePlayerSelect = (player: any) => {
    navigate(`/profile/${player.id}`);
  };

  const topPlayers = leaderboardData?.slice(0, 3);
  const totalPlayers = leaderboardData?.length || 0;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "PadelELO Leaderboard",
    "description": "Official padel rankings for Mauritius players",
    "url": "https://padel-elo.com/leaderboard",
    "sport": "Padel",
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MU",
        "addressLocality": "Mauritius"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Helmet>
        <title>Padel Rankings & Leaderboard - Mauritius | PadelELO</title>
        <meta 
          name="description" 
          content={`View official padel rankings for ${totalPlayers} players in Mauritius. Track MMR scores, match history, and climb the leaderboard in our competitive padel community.`}
        />
        <meta name="keywords" content="padel rankings mauritius, padel leaderboard, MMR rankings, padel players mauritius, competitive padel" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Padel Rankings & Leaderboard - Mauritius" />
        <meta property="og:description" content={`Official padel rankings for ${totalPlayers} players in Mauritius. See who's leading the leaderboard!`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://padel-elo.com/leaderboard" />
        <meta property="og:image" content="https://padel-elo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Padel Rankings - Mauritius" />
        <meta name="twitter:description" content="Official padel leaderboard for Mauritius players" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padel-elo.com/leaderboard" />
      </Helmet>
      
      <main className="container py-6 md:py-12 px-4 max-w-7xl mx-auto">
        
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          <LeaderboardHeader 
            filters={filters}
            onGenderChange={handleGenderChange}
            onFriendsOnlyChange={handleFriendsOnlyChange}
          />
          
          <LeaderboardTable 
            isLoading={isLoading}
            data={leaderboardData}
            userId={userId}
            onPlayerSelect={handlePlayerSelect}
          />
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
