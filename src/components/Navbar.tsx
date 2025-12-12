import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/belediye_yeni_logo.png" 
            alt="Keşan Belediyesi" 
            className="h-8 w-8"
          />
          <span className="font-medium text-lg tracking-tight">Bilgi İşlem Destek Talep Sistemi</span>
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/index">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Ana Sayfa</span>
            </Button>
          </Link>
          
          <Link to="/admin">
            <Button variant={location.pathname === '/admin' ? "secondary" : "ghost"} size="sm">
              Kontrol Paneli
            </Button>
          </Link>
        </div>
        
        {/* Mobile menu (dropdown) */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 flex flex-col space-y-4 md:hidden">
            <Link to="/index" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 w-full justify-start">
                <Home className="h-4 w-4" />
                <span>Ana Sayfa</span>
              </Button>
            </Link>
            
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              <Button variant={location.pathname === '/admin' ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
                Kontrol Paneli
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
