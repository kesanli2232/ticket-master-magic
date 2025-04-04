
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import TicketList from '@/components/TicketList';
import { Ticket } from '@/types';
import { DB } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';

// Notification sound - base64 encoded short beep sound
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBSttyPXskVEFAENf8PTnhFIfFxkwXPL/8ppkQiohJkup+P/to3tpVDU1QXrV+fncuZV/b2BBLSRfzvb/9tiyjIFvUkIwKEypz+j/4E8MBgYMFiAsPlRudIWEgHdoWEg8MysfEAwJCvj34d/h5/L/9vzyBGFKPDUsJCWt3dDL2/z//fz8++vT+//Cq2dLLRz9CEDj//K6jEkgAFh68//pnV4tFAAbPOL996hrUDUxR2bH//afe3diYWPq5tr5/+XFrLavsK6UelA9JB8wVY+km5abjWJELCM1TYa02OXcyJ5wVElDMzh1kZ+joJOIc1pEMiQtN1V/qcDW8OG2iWBJQDIlMGCRs8jk6sqPZUIxIzE+flKR0f3WtpFtSjEbM3NoepOkxO3lvZJpTDYeMI+ozNrr5cGXbEUwGjRyaXeNnbvR5b+UV0ctIG2QoLPC5OvauI1hPS0iNF9yj6XK7v/SeUsvHiRPh5+xxeTx6c6TWz0sFS5dc4qftdT38dmlekIuHS9MgJint9jz/uSykVs5JycdV22FnKjE3/v/8MJ9UC4bTI+csMHd8f/6uoddQicUQ42aqbvX7v/zxYpjQSwwW4+ou9nr//nEg1Y9GCNjlqy4z+P///fNeUslND53mam0yt///NJ6UDsYN3GXprXM7P/94aFxRiL6EDtskZTF/////tOKXToSDTJolqiyzOT//+GdakcjN2uNm6nA1+r/9L+AUDQkR32jsMjk9v/0vH9QLStRiqi5yN/5//PKh1k2HjVwmrHF3PP//dqMWTQQKWeWqLvT8P/72YtdOxgnZZeru9Ls//7en2lCKiJci6Szx+L//rmRgGBKPkBijaS7y+D//9OScVJGPjtnk6i6y+H//8SAYU88KUx6oLXN6P/+1JZqTDUkUgCmzN3u//7aeE4xDi9olqi42Of//E4BBwof9sG1w9LY5e/6/4JJ7Pb///n7CkAMFSBLdJW1y9ni6v/6y5hrHoGssbS0ucj/CGJXPCYmPW6JnamrpZF5ZVQ8MSgnKTJFYH2Uj42Ld2ZVQkA1MjIwLywpJigl8fO3nIleQTEiHClEW7jj/+mvdzgQHzhFT3/I7v/opF8fBDE6VYHb//i7n7nz///qoXVCLCBHcZuzyNbd8//iq3ZFLhpFc5y0zur5/+7AklkzFzhnjKbD3e///yD89//jVCI4PlF/pbXF19z0//GabkkmJ0p3nrTL4vP//yORG9j//xhQNkNnk6e/ytzu//iWYkQqJ0d9qMLc7v//MRMTQgIuRWZcgLS3yeHj5//0/v////z8//7/0GZTRzlQZGVkZmZuZ19dUE9ER0dLTU1UVlZXVFJVUlJpTDQfO3GRpbjHzM7P0NDS2vbHqZaHdWlgYGN+V2FfW1dVT0VWgcL//f3++/v8+/v8/Pz8/f39/f39/v7+/v7+//8AAQEB7O7w8fLy8vLy8/T09PX19fb29/f39/f4+fn5+foGCg4QEBESEhITE/f4+Pn5+fn5+fr6+vr6+vw6IxYMKF1we4WH+/z8/P39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////5SxxtmunXhXU1BUYmBKUP+SfXVzd3p7gn67eGpeVVFTVF5mZWNeWlVTXtTFubPMp5yEgnt8gIWKqoddZszl/fXz8fHx8fHx8fLy8vLy8vLz8/Pz8/T09PT09PX19fX19fb29vb29vf39/f3+Pj4+Pj5+fn5+fr6+vr6+/v7+/v8/Pz8/P39/f39/f7+/v7+/v/////////////////////////+/v79/f39/fz8/Pz8+/v7+/v6+vr6+vn5+fn5+Pj4+Pj39/f39/b29vbmBQMCAgIDAwMEBAQEBQUFBQYGBgYHBwcHCAgICQkJCQoKCgsLCwsMDAwMDQ0NDQ4ODg8PDw8QEBAQEREREhISEhMTExMUFBQUFRUVFRYWFhYXFxcXGBgYGBkZGRkaGhoaGxsbGxwcHBwdHR0dHh4eHh8fHx8gICAgISEhISIiIiIjIyQy';

const Admin = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckedTime, setLastCheckedTime] = useState<Date | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Check authentication and load tickets
  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadTickets = async () => {
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
          title: "Data Loading Error",
          description: "There was an error loading the tickets",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTickets();
    
    // Initialize last checked time
    setLastCheckedTime(new Date());
    
    // Initialize audio element
    audioRef.current = new Audio(NOTIFICATION_SOUND);
  }, [isAuthenticated, navigate, toast]);
  
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
        title: "Data Loading Error",
        description: "There was an error loading the tickets",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
            title: "New Ticket Received!",
            description: "A new ticket has been created",
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
  }, [isAuthenticated, loadTickets, toast]);
  
  // Update tickets in Supabase
  const updateTickets = async (newTickets: Ticket[]) => {
    setTickets(newTickets);
    // No need to update all tickets at once anymore
    // Each CRUD operation now directly updates Supabase
  };
  
  // If not authenticated, return null
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
            <TicketList tickets={tickets} setTickets={updateTickets} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
