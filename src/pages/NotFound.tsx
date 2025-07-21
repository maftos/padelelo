import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, Users } from "lucide-react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | PadelELO</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to PadelELO to continue your padel journey." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PageContainer>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-lg text-center">
            <CardHeader className="pb-4">
              <div className="text-6xl font-bold text-primary/20 mb-4">404</div>
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Sorry, we couldn't find the page you're looking for. 
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="default">
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                
                <Button asChild variant="outline" onClick={() => window.history.back()}>
                  <span className="flex items-center gap-2 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </span>
                </Button>
              </div>
              
              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Or explore these popular sections:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/leaderboard" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Leaderboard
                    </Link>
                  </Button>
                  
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/open-bookings" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Find Games
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default NotFound;