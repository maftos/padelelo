import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarRange, MapPin, Users } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { AddResultsWizard } from "./AddResultsWizard";

const ConfirmedMatchesList = () => {
  const [confirmedMatches, setConfirmedMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    const fetchConfirmedMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            booking_id,
            venue_id,
            start_time,
            title,
            description,
            status,
            participants (
              player_id,
              first_name,
              last_name,
              profile_photo,
              current_mmr
            )
          `)
          .eq('status', 'CONFIRMED');

        if (error) {
          console.error("Error fetching confirmed matches:", error);
          setError(error.message);
          toast.error("Failed to load confirmed matches: " + error.message);
        } else {
          setConfirmedMatches(data || []);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching confirmed matches:", err);
        setError(err.message);
        toast.error("Failed to load confirmed matches: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedMatches();
  }, []);

  const handleAddResults = (booking: any) => {
    // Transform booking data to the format expected by AddResultsWizard
    const bookingData = {
      booking_id: booking.booking_id,
      venue_id: booking.venue_id,
      start_time: booking.start_time,
      title: booking.title,
      description: booking.description,
      status: booking.status,
      participants: booking.participants || []
    };
    
    // Transform participants to players format
    const players = (booking.participants || []).map((p: any) => ({
      id: p.player_id,
      name: `${p.first_name} ${p.last_name}`.trim() || 'Unknown',
      photo: p.profile_photo
    }));

    setSelectedBooking({ bookingData, players });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const MatchItem = ({ match }: { match: any }) => (
    <li key={match.booking_id} className="border rounded-md p-4 bg-white shadow-sm">
      <div className="grid gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{match.title}</h3>
          <Badge variant="secondary">{match.status}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarRange className="h-4 w-4" />
          {format(parseISO(match.start_time), 'PPP')}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {match.venue_id || 'Location TBD'}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {match.participants?.length || 0} Players
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleAddResults(match)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add Results
          </button>
        </div>
      </div>
    </li>
  );

  const MatchItemSkeleton = () => (
    <li className="border rounded-md p-4 bg-white shadow-sm">
      <div className="grid gap-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="mt-4 flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </li>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Confirmed Matches</h2>
        <p className="text-muted-foreground">
          Here are the matches that have been confirmed and are awaiting results.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <ul className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <MatchItemSkeleton key={i} />
          ))}
        </ul>
      ) : confirmedMatches.length > 0 ? (
        <ul className="space-y-4">
          {confirmedMatches.map(match => (
            <MatchItem key={match.booking_id} match={match} />
          ))}
        </ul>
      ) : (
        <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
          No confirmed matches found.
        </div>
      )}
      
      {selectedBooking && (
        <AddResultsWizard
          bookingData={selectedBooking.bookingData}
          players={selectedBooking.players}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default ConfirmedMatchesList;
