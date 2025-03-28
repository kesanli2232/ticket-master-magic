
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

  // Load session data from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setIsAuthenticated(true);
        console.log("Session data loaded from localStorage:", parsedUser.username);
      } catch (error) {
        console.error("Error loading session data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = findUserByUsername(username);
    
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      setRole(foundUser.role);
      setIsAuthenticated(true);
      
      // Save session data to localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome, ${foundUser.displayName || username}!`,
        duration: 3000
      });
      
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid credentials",
      variant: "destructive",
      duration: 3000
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    
    // Remove session data from localStorage
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
