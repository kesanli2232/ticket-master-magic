
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TicketList from '@/components/TicketList';
import { Ticket } from '@/types';
import { generateMockTickets } from '@/lib/data';

const Admin = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Kimlik doğrulamasını kontrol et
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Önceki taleplerden (yani localStorage'dan) yükle veya boş bir liste kullan
    setIsLoading(true);
    
    // localStorage'dan talepleri al
    const savedTickets = localStorage.getItem('tickets');
    
    setTimeout(() => {
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      } else {
        // Eğer localStorage'da talep yoksa, boş bir dizi ata
        setTickets([]);
      }
      setIsLoading(false);
    }, 400);
  }, [isAuthenticated, navigate]);
  
  // Taleplerin değişikliklerini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="page-transition">
          <header className="mb-10">
            <h1 className="text-3xl font-semibold mb-2">Talep Yönetimi</h1>
            <p className="text-muted-foreground">
              Tüm destek taleplerini görüntüleyin, düzenleyin ve yönetin
            </p>
          </header>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Talepler yükleniyor...</p>
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
