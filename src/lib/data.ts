
import { User, Ticket, Department, Status, Priority, AssignedTo } from '@/types';

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // Gerçek bir uygulamada hashlenmesi gerekir
    role: 'admin'
  },
  {
    id: '2',
    username: 'viewer',
    password: 'viewer123', // Gerçek bir uygulamada hashlenmesi gerekir
    role: 'viewer'
  }
];

export const departments: Department[] = [
  'Afet İşleri Müdürlüğü',
  'Bilgi İşlem Müdürlüğü',
  'Destek Hizmetleri Müdürlüğü',
  'Emlak İstimlak Müdürlüğü',
  'Fen İşleri Müdürlüğü',
  'Hukuk İşleri Müdürlüğü',
  'İklim Değişikliği Sıfır Atık Müdürlüğü',
  'İmar ve Şehircilik Müdürlüğü',
  'İnsan Kaynakları ve Eğitim Müdürlüğü',
  'İtfaiye Müdürlüğü',
  'Kültür ve Sosyal İşler Müdürlüğü',
  'Makine İkmal Bakım ve Onarım Müdürlüğü',
  'Mali Hizmetler Müdürlüğü',
  'Park Bahçeler Müdürlüğü',
  'Sosyal Destek Hizmetleri Müdürlüğü',
  'Su ve Kanalizasyon Müdürlüğü',
  'Temizlik İşleri Müdürlüğü',
  'Veteriner İşleri Müdürlüğü',
  'Yazı İşleri Müdürlüğü',
  'Zabıta Müdürlüğü'
];

export const statuses: Status[] = ['Açık', 'Çözüldü'];

export const priorities: Priority[] = [
  'Çok Önemli',
  'Önemli',
  'İkincil'
];

export const assignees: AssignedTo[] = ['Emir', 'Ahmet', 'Atakan', 'Görkem'];

// Function to get the current time in Istanbul (GMT+3)
export const getIstanbulTime = () => {
  const now = new Date();
  const istanbulOffset = 3 * 60; // GMT+3 in minutes
  const localOffset = now.getTimezoneOffset();
  
  // Calculate total offset in milliseconds (local to Istanbul)
  const offsetMs = (localOffset + istanbulOffset) * 60 * 1000;
  
  // Create a new date object with Istanbul time
  return new Date(now.getTime() + offsetMs);
};

// Kullanıcının IP adresini almak için fonksiyon
export const getUserIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('IP adresi alınamadı:', error);
    return 'Bilinmiyor';
  }
};

// Database functions for tickets
export const DB = {
  // Save tickets to localStorage
  saveTickets: (tickets: Ticket[]): void => {
    try {
      localStorage.setItem('tickets', JSON.stringify(tickets));
      console.log('Tickets saved successfully:', tickets.length);
    } catch (error) {
      console.error('Error saving tickets to localStorage:', error);
    }
  },

  // Get all tickets from localStorage
  getTickets: (): Ticket[] => {
    try {
      const savedTickets = localStorage.getItem('tickets');
      if (!savedTickets) return [];
      
      const tickets = JSON.parse(savedTickets) as Ticket[];
      return tickets;
    } catch (error) {
      console.error('Error retrieving tickets from localStorage:', error);
      return [];
    }
  },

  // Add a new ticket
  addTicket: (ticket: Ticket): void => {
    const tickets = DB.getTickets();
    DB.saveTickets([ticket, ...tickets]);
  },

  // Update a ticket
  updateTicket: (updatedTicket: Ticket): void => {
    const tickets = DB.getTickets();
    const updatedTickets = tickets.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    DB.saveTickets(updatedTickets);
  },

  // Delete a ticket
  deleteTicket: (id: string): void => {
    const tickets = DB.getTickets();
    const filteredTickets = tickets.filter(ticket => ticket.id !== id);
    DB.saveTickets(filteredTickets);
  },

  // Remove tickets older than 7 days
  cleanupOldTickets: (): void => {
    const tickets = DB.getTickets();
    const now = getIstanbulTime();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= sevenDaysAgo;
    });
    
    if (tickets.length !== filteredTickets.length) {
      console.log(`Removed ${tickets.length - filteredTickets.length} tickets older than 7 days`);
      DB.saveTickets(filteredTickets);
    }
  }
};

export const generateMockTickets = (): Ticket[] => {
  // Boş bir dizi döndürerek otomatik ticket oluşturmayı durduruyoruz
  return [];
};

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};
