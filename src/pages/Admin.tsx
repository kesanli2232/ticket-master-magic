import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import TicketList from '@/components/TicketList';
import { Ticket } from '@/types';
import { DB } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { FileBarChart, X } from 'lucide-react';
import ReportPanel from '@/components/ReportPanel';

const Admin = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedTime, setLastCheckedTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showReports, setShowReports] = useState(false);
  
  // Load tickets on component mount
  useEffect(() => {
    const loadInitialTickets = async () => {
      setIsLoading(true);
      try {
        // Clean up old tickets
        await DB.cleanupOldTickets();
        
        // Get tickets from Supabase
        const tickets = await DB.getTickets();
        setTickets(tickets);
        console.log('Tickets loaded:', tickets.length);
      } catch (error) {
        console.error('Error loading tickets:', error);
        toast({
          title: "Veri Yükleme Hatası",
          description: "Talepler yüklenirken bir hata oluştu",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialTickets();
    
    // Initialize last checked time
    setLastCheckedTime(new Date());
    
    // Initialize audio element with the MP3 file
    audioRef.current = new Audio('/notification_sound.mp3');
  }, [toast]);
  
  // Function to load tickets
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Clean up old tickets
      await DB.cleanupOldTickets();
      
      // Get tickets from Supabase
      const tickets = await DB.getTickets();
      setTickets(tickets);
      console.log('Tickets loaded:', tickets.length);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Veri Yükleme Hatası",
        description: "Talepler yüklenirken bir hata oluştu",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    // Subscribe to INSERT events on the tickets table
    const channel = supabase
      .channel('tickets-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tickets'
        },
        async (payload) => {
          console.log('New ticket added:', payload);
          
          // Play notification sound
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error('Error playing notification sound:', e));
          }
          
          // Show toast notification
          toast({
            title: "Yeni Talep Alındı!",
            description: "Yeni bir destek talebi oluşturuldu",
            duration: 5000
          });
          
          // Refresh tickets
          await loadTickets();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tickets'
        },
        async () => {
          // Refresh tickets when any ticket is updated
          await loadTickets();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'tickets'
        },
        async () => {
          // Refresh tickets when any ticket is deleted
          await loadTickets();
        }
      )
      .subscribe();
    
    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTickets, toast]);
  
  // Update tickets in Supabase
  const updateTickets = async (newTickets: Ticket[]) => {
    setTickets(newTickets);
  };
  
  // Toggle reports panel
  const toggleReportsPanel = () => {
    setShowReports(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="page-transition">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Talep Yönetimi</h1>
              <p className="text-muted-foreground">
                Tüm destek taleplerini görüntüleyin ve yönetin
              </p>
            </div>
            
            <Button 
              onClick={toggleReportsPanel}
              className="flex items-center gap-2"
              variant={showReports ? "outline" : "default"}
            >
              {showReports ? (
                <>
                  <X size={18} />
                  Raporu Kapat
                </>
              ) : (
                <>
                  <FileBarChart size={18} />
                  Rapor Oluştur
                </>
              )}
            </Button>
          </header>
          
          {showReports ? (
            <ReportPanel onClose={() => setShowReports(false)} />
          ) : (
            isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Talepler yükleniyor...</p>
              </div>
            ) : (
              <TicketList tickets={tickets} setTickets={updateTickets} />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
