
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, LogOut, User, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-medium text-lg tracking-tight">Ticket System</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/admin">
                <Button variant={location.pathname === '/admin' ? "secondary" : "ghost"} size="sm">
                  Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.username} ({user?.role})</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant={location.pathname === '/login' ? "secondary" : "ghost"} size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
