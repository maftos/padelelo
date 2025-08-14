import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Trophy, TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import avatarJohn from "@/assets/avatar-john.jpg";
import avatarMaria from "@/assets/avatar-maria.jpg";
import avatarAlex from "@/assets/avatar-alex.jpg";
import avatarSarah from "@/assets/avatar-sarah.jpg";
import avatarMike from "@/assets/avatar-mike.jpg";

export const ProductShowcaseSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to excel
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            Our platform provides all the tools you need to improve your game and connect with the community
          </p>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {/* Open Matches Showcase */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="px-4 sm:px-0">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Find Open Matches
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Join existing bookings or create your own. Connect with players of similar skill levels 
                and enjoy competitive matches at premium courts across Mauritius.
              </p>
              <Button asChild className="text-base px-6 sm:px-8 py-3 w-full sm:w-auto">
                <Link to="/open-bookings">Browse Open Matches</Link>
              </Button>
            </div>
            <div className="relative px-4 sm:px-0">
              <Card className="shadow-lg bg-background border hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 px-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <CardTitle className="text-lg leading-tight">
                          Weekend Match at Elite Courts
                        </CardTitle>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                          2h ago
                        </span>
                      </div>
                      
                      {/* First row: Start Time and Fee */}
                      <div className="flex flex-col gap-1 text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">Sat, Dec 21 • 2:00 PM</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span>Rs 500</span>
                        </div>
                      </div>
                      
                      {/* Second row: Location */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Elite Padel Courts, Ebène</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-6">
                  <CardDescription className="mb-4 text-sm leading-relaxed">
                    Looking for 1 more player for a fun match. All skill levels welcome!
                  </CardDescription>
                  
                  {/* Current Players - Mobile optimized grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">
                        Current Players (avg: 2,850 MMR)
                      </h4>
                    </div>
                    
                    {/* Players grid - 2x2 layout */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 min-h-[60px]">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={avatarJohn} alt="John S" />
                          <AvatarFallback className="text-xs">JS</AvatarFallback>
                        </Avatar>
                        <div className="text-sm flex-1 min-w-0">
                          <div className="font-medium truncate">John S</div>
                          <div className="text-xs text-muted-foreground">2,920 MMR</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 min-h-[60px]">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={avatarMaria} alt="Maria J" />
                          <AvatarFallback className="text-xs">MJ</AvatarFallback>
                        </Avatar>
                        <div className="text-sm flex-1 min-w-0">
                          <div className="font-medium truncate">Maria J</div>
                          <div className="text-xs text-muted-foreground">2,780 MMR</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 min-h-[60px]">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={avatarAlex} alt="Alex C" />
                          <AvatarFallback className="text-xs">AC</AvatarFallback>
                        </Avatar>
                        <div className="text-sm flex-1 min-w-0">
                          <div className="font-medium truncate">Alex C</div>
                          <div className="text-xs text-muted-foreground">2,850 MMR</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 border-2 border-dashed border-primary/30 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 min-h-[60px] touch-manipulation">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">+</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary text-sm">Join Game</div>
                          <div className="text-xs text-muted-foreground">Tap to join</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leaderboard Showcase */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="lg:order-2 px-4 sm:px-0">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Track Your Progress
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Climb the leaderboard and see how you stack up against other players. 
                Our ELO system ensures fair matchmaking and accurate skill assessment.
              </p>
              <Button asChild variant="outline" className="text-base px-6 sm:px-8 py-3 w-full sm:w-auto">
                <Link to="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
            <div className="lg:order-1 relative px-4 sm:px-0">
              <Card className="shadow-lg bg-background border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Current Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { rank: 75, name: "Alex C", mmr: 2920, change: +3, avatar: avatarAlex, flag: "🇫🇷" },
                      { rank: 76, name: "Sarah W", mmr: 2880, change: -2, avatar: avatarSarah, flag: "🇿🇦" },
                      { rank: 77, name: "You", mmr: 2850, change: +5, highlight: true, flag: "🇲🇺" },
                      { rank: 78, name: "Mike J", mmr: 2820, change: -1, avatar: avatarMike, flag: "🇬🇧" },
                      { rank: 79, name: "Maria J", mmr: 2780, change: +2, avatar: avatarMaria, flag: "🇪🇸" }
                    ].map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          player.highlight ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                        }`}
                      >
                        <div className="w-8 text-center font-medium text-sm">
                          #{player.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          {player.avatar && <AvatarImage src={player.avatar} alt={player.name} />}
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{player.name}</span>
                            <span className="text-sm">{player.flag}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{player.mmr} MMR</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {player.change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-xs font-medium ${
                            player.change > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {player.change > 0 ? '+' : ''}{player.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Padel Courts Showcase */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="px-4 sm:px-0">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Discover Padel Courts
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Explore all padel courts across Mauritius with our comprehensive directory. 
                Find the perfect venue, check amenities, and book your next game easily.
              </p>
              <Button asChild variant="outline" className="text-base px-6 sm:px-8 py-3 w-full sm:w-auto">
                <Link to="/padel-courts">Browse Courts</Link>
              </Button>
            </div>
            <div className="relative px-4 sm:px-0">
              <Card className="shadow-lg bg-background border overflow-hidden">
                <div className="relative h-32 w-full">
                  <img
                    src="/lovable-uploads/ace216a4-b3e4-429e-8b4a-cf1184626be1.png"
                    alt="Summer Championship Tournament"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-500 text-white">Open</Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight">
                      Summer Championship 2024
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md whitespace-nowrap">
                      Starting Soon
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Jan 15-16, 2024</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Elite Padel Courts, Ebène</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>12/16 teams registered</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-sm">
                    Premier tournament featuring top players competing for a Rs 25,000 prize pool. 
                    Single elimination format with exciting matches.
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Prize Pool: </span>
                      <span className="font-medium text-primary">Rs 25,000</span>
                    </div>
                    <Button size="sm" className="h-8">
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};