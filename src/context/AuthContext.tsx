
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '@/types';
import { findUserByUsername } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  role: Role | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Kullanıcı verilerinin sessionStorage'da olup olmadığını kontrol et
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = findUserByUsername(username);
    
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      setRole(foundUser.role);
      setIsAuthenticated(true);
      
      // Kullanıcıyı sessionStorage'a kaydet
      sessionStorage.setItem('user', JSON.stringify(foundUser));
      
      toast({
        title: "Giriş başarılı",
        description: `Hoş geldiniz, ${username}!`,
        duration: 3000
      });
      
      return true;
    }
    
    toast({
      title: "Giriş başarısız",
      description: "Geçersiz kullanıcı adı veya şifre",
      variant: "destructive",
      duration: 3000
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    
    // Kullanıcı verilerini sessionStorage'dan temizle
    sessionStorage.removeItem('user');
    
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız",
      duration: 3000
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır');
  }
  return context;
};
