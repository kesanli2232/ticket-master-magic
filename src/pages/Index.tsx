
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import TicketForm from '@/components/TicketForm';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Ticket, Category, Department } from '@/types';
import { ChevronRight, MessageSquare, CheckCircle2, Clock, Activity } from 'lucide-react';

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { toast } = useToast();
  
  const handleAddTicket = (newTicket: {
    title: string;
    description: string;
    category: Category;
    createdByName: string;
    createdBySurname: string;
    createdByDepartment: Department;
  }) => {
    // In a real application, this would be sent to a server
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      ...newTicket,
      status: 'Open',
      // Auto-assign 'Very Important' priority for 'Printer Issue' category
      priority: newTicket.category === 'Printer Issue' ? 'Very Important' : 'Secondary',
      assignedTo: 'Emir', // Default assignee
      createdAt: new Date().toISOString()
    };
    
    setTickets([ticket, ...tickets]);
    
    toast({
      title: "Ticket Created",
      description: "Your ticket has been submitted successfully!",
      duration: 5000
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="page-transition max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
                Municipal Ticket Management System
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Submit and track support requests easily with our streamlined ticket system
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/admin">
                  <Button size="lg" className="gap-2">
                    <span>Go to Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Easy Submission</h3>
                <p className="text-muted-foreground">
                  Create tickets quickly with our streamlined submission form
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Status Tracking</h3>
                <p className="text-muted-foreground">
                  Track the status of your tickets from submission to resolution
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-sm border border-border">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Priority Management</h3>
                <p className="text-muted-foreground">
                  Automatically prioritizes critical issues like printer problems
                </p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Submit a New Ticket</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Fill out the form below to create a new support ticket. Our team will respond as soon as possible.
                </p>
              </div>
              
              <TicketForm addTicket={handleAddTicket} />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Municipal Ticket Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
