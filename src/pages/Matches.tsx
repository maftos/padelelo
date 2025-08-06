
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmedMatches } from "@/hooks/use-confirmed-matches";
import { Navigation } from "@/components/Navigation";
import { Loading } from "@/components/ui/loading";
import { BookingCard } from "@/components/match/BookingCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface MatchDetails {
  match_id: string;
  old_mmr: number;
  change_amount: number;
  change_type: string;
  created_at: string;
  partner_id: string;
  new_mmr: number;
  status: string;
  team1_score: number;
  team2_score: number;
  team1_player1_display_name: string;
  team1_player1_profile_photo: string;
  team1_player2_display_name: string;
  team1_player2_profile_photo: string;
  team2_player1_display_name: string;
  team2_player1_profile_photo: string;
  team2_player2_display_name: string;
  team2_player2_profile_photo: string;
  completed_by?: string;
  player1_id?: string;
  player2_id?: string;
  player3_id?: string;
  player4_id?: string;
  sets?: Array<{
    set_number: number;
    team1_score: number;
    team2_score: number;
  }>;
}

const Matches = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { confirmedMatches: bookings, pagination, isLoading, error } = useConfirmedMatches(currentPage, pageSize);

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container py-6 sm:py-12 px-3 sm:px-4 max-w-4xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-6">
            <div className="text-center space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
                Match History
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">Track your padel journey and performance</p>
            </div>
            
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <Loading />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Error loading matches: {error.message}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No matches found</p>
              </div>
            ) : (
              <>
                {bookings.map((booking) => (
                  <BookingCard 
                    key={booking.booking_id}
                    booking_id={booking.booking_id}
                    date={booking.start_time}
                    location={booking.venue_name}
                    status={booking.status}
                    matches={booking.matches}
                    mmr_before={booking.mmr_before}
                    mmr_after={booking.mmr_after}
                  />
                ))}
                
                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                          className={currentPage === pagination.total_pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matches;
