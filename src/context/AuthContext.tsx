
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
    // Kullanıcı verilerinin localStorage'da olup olmadığını kontrol et
    // sessionStorage yerine localStorage kullanarak oturum kalıcılığını sağla
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setIsAuthenticated(true);
        console.log("Oturum bilgileri localStorage'dan yüklendi:", parsedUser.username);
      } catch (error) {
        console.error("Oturum bilgileri yüklenirken hata oluştu:", error);
        // Hatalı veri varsa temizle
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // username artık firstName_lastName formatında gelecek
    const foundUser = findUserByUsername(username);
    
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      setRole(foundUser.role);
      setIsAuthenticated(true);
      
      // Kullanıcıyı localStorage'a kaydet (sessionStorage yerine)
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      toast({
        title: "Giriş başarılı",
        description: `Hoş geldiniz, ${foundUser.displayName || username}!`,
        duration: 3000
      });
      
      return true;
    }
    
    toast({
      title: "Giriş başarısız",
      description: "Geçersiz kullanıcı bilgileri",
      variant: "destructive",
      duration: 3000
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    
    // Kullanıcı verilerini localStorage'dan temizle
    localStorage.removeItem('user');
    
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
