import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Trophy, TrendingUp, Clock } from "lucide-react";

export const ProductShowcaseSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to excel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover, compete, and track your progress with our comprehensive platform
          </p>
        </div>

        <div className="space-y-20">
          {/* Open Matches Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Discover Open Matches
              </h3>
              <p className="text-lg text-muted-foreground">
                Find and join padel matches in your area. Connect with players of similar skill levels and book courts seamlessly.
              </p>
              <Button size="lg" className="text-base px-8">
                Browse Matches
              </Button>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Evening Social Match</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>Phoenix Sports Club</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Open</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Today, 6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>2/4 players</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">JS</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">MK</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">+2 spots available</span>
                </div>
                <Button className="w-full" variant="outline">Join Match</Button>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Weekend Tournament Prep</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>Elite Padel Center</span>
                    </div>
                  </div>
                  <Badge variant="outline">MMR 1400+</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Tomorrow, 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>3/4 players</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">AR</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">LC</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">TM</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">+1 spot available</span>
                </div>
                <Button className="w-full" variant="outline">Join Match</Button>
              </Card>
            </div>
          </div>

          {/* Leaderboard Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-foreground">Top Players</h4>
                  <Badge variant="secondary">This Month</Badge>
                </div>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Alex Rodriguez", mmr: 1847, change: "+23", flag: "🇪🇸" },
                    { rank: 2, name: "Maria Santos", mmr: 1832, change: "+15", flag: "🇧🇷" },
                    { rank: 3, name: "James Wilson", mmr: 1798, change: "+8", flag: "🇬🇧" },
                    { rank: 4, name: "Sofia Chen", mmr: 1776, change: "-5", flag: "🇨🇳" },
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 text-center font-semibold text-muted-foreground">
                        #{player.rank}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{player.name}</span>
                          <span className="text-sm">{player.flag}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{player.mmr.toLocaleString()} MMR</span>
                          <span className={player.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                            {player.change}
                          </span>
                        </div>
                      </div>
                      <Trophy className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Track Your Progress
              </h3>
              <p className="text-lg text-muted-foreground">
                Climb the rankings with our advanced MMR system. See how you stack up against players in your region and beyond.
              </p>
              <Button size="lg" className="text-base px-8">
                View Rankings
              </Button>
            </div>
          </div>

          {/* Match History Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Analyze Your Matches
              </h3>
              <p className="text-lg text-muted-foreground">
                Review detailed match statistics, track your performance over time, and identify areas for improvement.
              </p>
              <Button size="lg" className="text-base px-8">
                View History
              </Button>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="font-semibold text-foreground">Victory vs Team Alpha</div>
                      <div className="text-sm text-muted-foreground">Phoenix Sports Club</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18 MMR
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>2 hours ago</span>
                  </div>
                  <span className="font-medium text-foreground">6-4, 6-2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Partners:</span>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">John Doe</span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div>
                      <div className="font-semibold text-foreground">Close Loss vs Pro Team</div>
                      <div className="text-sm text-muted-foreground">Elite Padel Center</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    -12 MMR
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>1 day ago</span>
                  </div>
                  <span className="font-medium text-foreground">4-6, 6-3, 4-6</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Partners:</span>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">SM</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Sarah Miller</span>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="font-semibold text-foreground">Dominant Win</div>
                      <div className="text-sm text-muted-foreground">Central Sports Complex</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +25 MMR
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>3 days ago</span>
                  </div>
                  <span className="font-medium text-foreground">6-1, 6-0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Partners:</span>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">MJ</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Mike Johnson</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};