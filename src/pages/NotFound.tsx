
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Hatası: Kullanıcı varolmayan bir rotaya erişmeye çalıştı:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="page-transition text-center max-w-md">
          <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Aradığınız sayfa bulunamadı veya taşınmış olabilir.
          </p>
          <Link to="/">
            <Button size="lg">Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
