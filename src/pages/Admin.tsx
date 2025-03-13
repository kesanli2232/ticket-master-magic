
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TicketList from '@/components/TicketList';
import { Ticket, Status } from '@/types';
import { generateMockTickets } from '@/lib/data';

const Admin = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load mock tickets
    setIsLoading(true);
    
    // Simulate API call with a slight delay
    setTimeout(() => {
      const mockTickets = generateMockTickets();
      setTickets(mockTickets);
      setIsLoading(false);
    }, 800);
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="page-transition">
          <header className="mb-10">
            <h1 className="text-3xl font-semibold mb-2">Ticket Management</h1>
            <p className="text-muted-foreground">
              View, edit, and manage all support tickets
            </p>
          </header>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading tickets...</p>
            </div>
          ) : (
            <TicketList tickets={tickets} setTickets={setTickets} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
