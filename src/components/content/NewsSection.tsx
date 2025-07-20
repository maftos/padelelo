import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ChevronRight, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { SocialShare } from "@/components/seo/SocialShare";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: "tournament" | "community" | "feature" | "announcement";
  featured?: boolean;
  imageUrl?: string;
}

interface NewsSectionProps {
  news?: NewsItem[];
  showFeatured?: boolean;
  maxItems?: number;
  title?: string;
}

// Sample news data - in a real app this would come from a CMS or database
const defaultNews: NewsItem[] = [
  {
    id: "1",
    title: "New Tournament Registration System Launch",
    excerpt: "We've launched an improved tournament registration system with better user experience and automated notifications.",
    content: "Our new tournament registration system makes it easier than ever to sign up for tournaments in Mauritius. Features include instant notifications, automatic waitlist management, and improved mobile experience.",
    author: "PadelELO Team",
    publishDate: "2024-01-15",
    category: "feature",
    featured: true,
    imageUrl: "/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png"
  },
  {
    id: "2", 
    title: "Community Milestone: 500+ Active Players",
    excerpt: "PadelELO Mauritius reaches 500 active players, making it the largest padel community on the island.",
    content: "We're excited to announce that PadelELO has reached over 500 active players across Mauritius. This milestone represents the growing padel community and the success of our ranking system.",
    author: "Community Team",
    publishDate: "2024-01-10",
    category: "community",
    featured: false
  },
  {
    id: "3",
    title: "January Tournament Series Announced",
    excerpt: "Five exciting tournaments planned for January across different skill levels and venues in Mauritius.",
    content: "Get ready for an action-packed January with five tournaments across the island. From beginner-friendly events to pro-level competitions, there's something for every padel player.",
    author: "Tournament Director",
    publishDate: "2024-01-05",
    category: "tournament",
    featured: false
  }
];

export const NewsSection = ({ 
  news = defaultNews, 
  showFeatured = false,
  maxItems = 3,
  title = "Latest News & Updates"
}: NewsSectionProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredNews = showFeatured 
    ? news.filter(item => item.featured)
    : news.slice(0, maxItems);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryColor = (category: NewsItem['category']) => {
    const colors = {
      tournament: "bg-blue-100 text-blue-800",
      community: "bg-green-100 text-green-800", 
      feature: "bg-purple-100 text-purple-800",
      announcement: "bg-orange-100 text-orange-800"
    };
    return colors[category];
  };

  if (filteredNews.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Newspaper className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <Card key={item.id} className={`hover:shadow-lg transition-shadow ${item.featured ? 'border-primary' : ''}`}>
              {item.imageUrl && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.featured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className={getCategoryColor(item.category)}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <SocialShare
                      url={`${window.location.origin}/news/${item.id}`}
                      title={item.title}
                      description={item.excerpt}
                      hashtags={["padel", "mauritius", item.category]}
                      showZapierIntegration={true}
                    />
                  </div>
                </div>
                
                <CardTitle className="text-lg leading-tight">
                  {item.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isExpanded ? item.content : item.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(item.publishDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full justify-between"
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};