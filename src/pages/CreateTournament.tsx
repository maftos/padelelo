
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Calendar as CalendarIcon, Clock, Globe, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Venue {
  venue_id: string;
  name: string;
}

export default function CreateTournament() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEndDate, setShowEndDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  
  const defaultPhoto = 'https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/tournament-photos//manuel-pappacena-zTwzxr4BbTA-unsplash.webp';

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venue: "",
    description: "",
  });

  // Time options in 15-minute intervals
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch venues on component mount
  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.rpc('get_venues');
      if (error) {
        toast.error("Failed to load venues");
        return;
      }
      setVenues((data as unknown) as Venue[]);
    };
    fetchVenues();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to create a tournament");
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();
      const endDateTime = showEndDate 
        ? new Date(`${formData.endDate}T${formData.endTime}+04:00`).toISOString()
        : new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();

      const { error } = await supabase.rpc('create_tournament', {
        p_max_players: 16,
        p_venue_id: formData.venue,
        p_start_date: startDateTime,
        p_end_date: endDateTime,
        p_bracket_type: "SINGLE_ELIM",
        p_user_a_id: user.id,
      });

      if (error) throw error;

      toast.success("Tournament created successfully!");
      navigate("/tournaments");
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error("Failed to create tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={defaultPhoto}
                alt="Tournament cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid gap-6">
              {/* Event Name Input */}
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="peer h-14 pt-4"
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 top-2 text-xs text-gray-500 transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs"
                >
                  Event Name
                </label>
              </div>

              {/* Date and Time Grid */}
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-14 pt-4 w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(new Date(formData.startDate), "PPP")
                          ) : (
                            <span>Select Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate ? new Date(formData.startDate) : undefined}
                          onSelect={(date) =>
                            setFormData({
                              ...formData,
                              startDate: date ? format(date, 'yyyy-MM-dd') : ''
                            })
                          }
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
                      Start Date
                    </label>
                  </div>

                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-14 pt-4 w-full justify-start text-left font-normal",
                            !formData.startTime && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {formData.startTime ? (
                            format(new Date(`2000-01-01T${formData.startTime}`), "h:mm a")
                          ) : (
                            <span>Select Time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-2" align="start">
                        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                          {timeOptions.map((time) => (
                            <Button
                              key={time}
                              variant="ghost"
                              className={cn(
                                "justify-start font-normal",
                                formData.startTime === time && "bg-accent text-accent-foreground"
                              )}
                              onClick={() => {
                                setFormData({ ...formData, startTime: time });
                              }}
                            >
                              {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
                      Start Time
                    </label>
                  </div>
                </div>

                {/* Optional End Date Toggle */}
                <button
                  type="button"
                  onClick={() => setShowEndDate(!showEndDate)}
                  className="mt-2 text-sm text-primary hover:underline focus:outline-none"
                >
                  {showEndDate ? "Remove end date/time" : "+ Add end date and time"}
                </button>
              </div>

              {/* Optional End Date/Time */}
              {showEndDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-14 pt-4 w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(new Date(formData.endDate), "PPP")
                          ) : (
                            <span>Select Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate ? new Date(formData.endDate) : undefined}
                          onSelect={(date) =>
                            setFormData({
                              ...formData,
                              endDate: date ? format(date, 'yyyy-MM-dd') : ''
                            })
                          }
                          disabled={(date) =>
                            date < (formData.startDate ? new Date(formData.startDate) : new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
                      End Date
                    </label>
                  </div>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-14 pt-4 w-full justify-start text-left font-normal",
                            !formData.endTime && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {formData.endTime ? (
                            format(new Date(`2000-01-01T${formData.endTime}`), "h:mm a")
                          ) : (
                            <span>Select Time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-2" align="start">
                        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                          {timeOptions.map((time) => (
                            <Button
                              key={time}
                              variant="ghost"
                              className={cn(
                                "justify-start font-normal",
                                formData.endTime === time && "bg-accent text-accent-foreground"
                              )}
                              onClick={() => {
                                setFormData({ ...formData, endTime: time });
                              }}
                            >
                              {format(new Date(`2000-01-01T${time}`), "h:mm a")}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
                      End Time
                    </label>
                  </div>
                </div>
              )}

              {/* Location Select */}
              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                <Select
                  value={formData.venue}
                  onValueChange={(value) => setFormData({ ...formData, venue: value })}
                >
                  <SelectTrigger className="h-14 pt-4 pl-10">
                    <SelectValue placeholder=" " />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.venue_id} value={venue.venue_id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="absolute left-10 top-2 text-xs text-gray-500 z-10">
                  Location
                </label>
              </div>

              {/* Visibility Input (Disabled) */}
              <div className="relative">
                <Globe className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  value="Public"
                  disabled
                  className="peer h-14 pt-4 pl-10"
                  placeholder=" "
                />
                <label className="absolute left-10 top-2 text-xs text-gray-500">
                  Visibility
                </label>
              </div>

              {/* Description Textarea */}
              <div className="relative">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px] pt-6 resize-y"
                  style={{ minHeight: '7.5rem' }}
                  placeholder=" "
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500">
                  Description
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Tournament"}
            </Button>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
