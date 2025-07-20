import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Helmet } from "react-helmet";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  customTitle?: string;
}

export const Breadcrumbs = ({ items, customTitle }: BreadcrumbsProps) => {
  const location = useLocation();
  
  // Generate breadcrumbs from URL if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: "Home", url: "/" }
    ];
    
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format segment name
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      name = name.replace(/-/g, ' ');
      
      // Special cases for better naming
      if (segment === 'tournaments') name = 'Tournaments';
      if (segment === 'leaderboard') name = 'Leaderboard';
      if (segment === 'profile') name = 'Profile';
      if (segment === 'how-it-works') name = 'How It Works';
      if (segment === 'matchmaking-math') name = 'Matchmaking Math';
      
      breadcrumbs.push({
        name: customTitle && index === pathSegments.length - 1 ? customTitle : name,
        url: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://padel-elo.com${item.url}`
    }))
  };
  
  // Don't show breadcrumbs for home page
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
              
              {index === 0 ? (
                <Link 
                  to={item.url}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              ) : index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{item.name}</span>
              ) : (
                <Link 
                  to={item.url}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};