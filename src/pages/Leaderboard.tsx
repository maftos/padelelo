
import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";

import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { useLeaderboardFilters } from "@/hooks/use-leaderboard-filters";
import { useLeaderboardData } from "@/hooks/use-leaderboard-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";



const Leaderboard = () => {
  const { user } = useAuth();
  const { userId } = useUserProfile();
  const { filters, handleGenderChange, handleFriendsOnlyChange } = useLeaderboardFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: leaderboardResponse, isLoading } = useLeaderboardData({ page: currentPage, limit: 25 });
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handlePlayerSelect = (player: any) => {
    navigate(`/profile/${player.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPlayers = leaderboardResponse?.totalCount || 0;
  const totalPages = leaderboardResponse?.totalPages || 1;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "PadelELO Leaderboard",
    "description": "Official padel rankings for Mauritius players",
    "url": "https://padelelo.com/leaderboard",
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
        <meta property="og:url" content="https://padelelo.com/leaderboard" />
        <meta property="og:image" content="https://padelelo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        <meta property="og:locale" content="en_MU" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Padel Rankings - Mauritius" />
        <meta name="twitter:description" content="Official padel leaderboard for Mauritius players" />
        <meta name="twitter:site" content="@padelelo" />
        <meta name="twitter:creator" content="@padelelo" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        <link rel="canonical" href="https://padelelo.com/leaderboard" />
      </Helmet>
      
      <main className="container py-6 md:py-12 px-4 max-w-7xl mx-auto">
        
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              Mauritius Padel Rankings
            </h1>
            <p className="text-muted-foreground text-lg">Compete with the island's finest players</p>
          </div>
          
          <LeaderboardTable 
            isLoading={isLoading}
            data={leaderboardResponse?.players}
            userId={userId}
            onPlayerSelect={handlePlayerSelect}
            currentPage={currentPage}
          />

          {!isLoading && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
