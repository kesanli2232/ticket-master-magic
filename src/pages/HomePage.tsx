
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import TicketForm from '@/components/TicketForm';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Ticket, Department } from '@/types';
import { ChevronRight, CheckCircle2, Clock, Activity } from 'lucide-react';
import { getIstanbulTime, DB, getUserIpAddress } from '@/lib/data';

const HomePage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorName, setVisitorName] = useState<string>('');
  const { toast } = useToast();
  
  // Ziyaretçi ismini localStorage'dan al
  useEffect(() => {
    const storedName = localStorage.getItem('visitorName');
    setVisitorName(storedName || 'Ziyaretçi');
  }, []);
  
  // Load tickets from Supabase
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true);
      try {
        // Clean up tickets older than 7 days
        await DB.cleanupOldTickets();
        
        // Get tickets from Supabase
        const tickets = await DB.getTickets();
        setTickets(tickets);
        console.log('HomePage: Tickets loaded:', tickets.length);
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
    
    loadTickets();
  }, [toast]);
  
  const handleAddTicket = async (newTicket: {
    title: string;
    description: string;
    createdByName: string;
    createdBySurname: string;
    createdByDepartment: Department;
  }) => {
    setIsLoading(true);
    
    try {
      // IP adresini al
      const ipAddress = await getUserIpAddress();
      
      // Create a new ticket - use Istanbul time
      const ticket: Ticket = {
        id: `ticket-${Date.now()}`,
        ...newTicket,
        status: 'Açık',
        priority: 'İkincil',
        assignedTo: 'Emir', // Default assignee
        createdAt: getIstanbulTime().toISOString(),
        ipAddress // IP adresini ekliyoruz
      };
      
      // Add to Supabase
      await DB.addTicket(ticket);
      
      // Update local state - get fresh tickets from Supabase
      const updatedTickets = await DB.getTickets();
      setTickets(updatedTickets);
      
      toast({
        title: "Talep Oluşturuldu",
        description: "Talebiniz başarıyla gönderildi!",
        duration: 5000
      });
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast({
        title: "Talep Oluşturma Hatası",
        description: "Talebiniz gönderilirken bir hata oluştu",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="page-transition max-w-4xl mx-auto">
            {/* Hoş Geldiniz Mesajı */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border mb-8">
              <h2 className="text-2xl font-semibold mb-2">Hoş geldiniz, {visitorName}</h2>
              <p className="text-muted-foreground">
                Belediye talep yönetim sistemine hoş geldiniz. Aşağıdaki formu kullanarak yeni bir talep oluşturabilirsiniz.
              </p>
            </div>
            
            {/* Hero Bölümü */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6">
                <img 
                  src="/belediye_yeni_logo.png" 
                  alt="Keşan Belediyesi" 
                  className="h-8 w-8"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
                Belediye Talep Yönetim Sistemi
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Sorunsuz talep sistemiyle destek taleplerini kolayca gönderin ve takip edin
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/admin">
                  <Button size="lg" className="gap-2">
                    <span>Kontrol Paneline Git</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Özellikler Bölümü */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <img 
                    src="/belediye_yeni_logo.png" 
                    alt="Keşan Belediyesi" 
                    className="h-6 w-6"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Kolay Başvuru</h3>
                <p className="text-muted-foreground">
                  Sorunsuz başvuru formumuzla talepleri hızlıca oluşturun
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Durum Takibi</h3>
                <p className="text-muted-foreground">
                  Taleplerinizin durumunu gönderimden çözüme kadar takip edin
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Öncelik Yönetimi</h3>
                <p className="text-muted-foreground">
                  Yazıcı sorunları gibi kritik konuları otomatik olarak önceliklendirir
                </p>
              </div>
            </div>
            
            {/* Form Bölümü */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Yeni Talep Oluştur</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Yeni bir destek talebi oluşturmak için aşağıdaki formu doldurun. Ekibimiz en kısa sürede yanıt verecektir.
                </p>
              </div>
              
              <TicketForm addTicket={handleAddTicket} />
            </div>
          </div>
        </section>
      </main>
      
      {/* Altbilgi */}
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Belediye Talep Yönetim Sistemi
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
