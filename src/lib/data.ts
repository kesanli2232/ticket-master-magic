import { User, Ticket, Department, Status, Priority, AssignedTo } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Supabase'den kullanıcıları getirmek için fonksiyon
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*');
    
    if (error) {
      console.error('Supabase\'den kullanıcılar getirilirken hata oluştu:', error);
      return [];
    }
    
    // Verileri User tipine dönüştürelim
    const users: User[] = data.map(user => ({
      id: user.id,
      username: user.username,
      password: user.password,
      role: user.role as 'admin' | 'viewer',
      displayName: user.display_name || user.username
    }));
    
    return users;
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return [];
  }
};

// Kullanıcıları Supabase'den getiren fonksiyon - artık users dizisi yerine bunu kullanacağız
export const findUserByUsername = async (username: string): Promise<User | undefined> => {
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .ilike('username', username)
      .single();
    
    if (error || !data) {
      console.error('Kullanıcı bulunamadı:', error);
      return undefined;
    }
    
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      role: data.role as 'admin' | 'viewer',
      displayName: data.display_name || data.username
    };
  } catch (error) {
    console.error('Kullanıcı aranırken hata:', error);
    return undefined;
  }
};

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

export const statuses: Status[] = ['Açık', 'İşlemde', 'Çözüldü', 'Çözülemedi'];

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
  // Save tickets to Supabase
  saveTickets: async (tickets: Ticket[]): Promise<void> => {
    try {
      // This function is kept for compatibility but not used directly
      console.log('saveTickets method is deprecated, use individual CRUD operations instead');
    } catch (error) {
      console.error('Error saving tickets to Supabase:', error);
    }
  },

  // Get all tickets from Supabase
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tickets from Supabase:', error);
        return [];
      }
      
      // Format the data to match our Ticket type
      const tickets = data.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status as Status,
        priority: ticket.priority as Priority,
        assignedTo: ticket.assigned_to as AssignedTo,
        createdByName: ticket.created_by_name,
        createdBySurname: ticket.created_by_surname,
        createdByDepartment: ticket.created_by_department as Department,
        createdAt: ticket.created_at,
        ipAddress: ticket.ip_address,
        rejectionComment: ticket.rejection_comment
      }));
      
      return tickets;
    } catch (error) {
      console.error('Error retrieving tickets from Supabase:', error);
      return [];
    }
  },

  // Add a new ticket to Supabase
  addTicket: async (ticket: Ticket): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .insert({
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          assigned_to: ticket.assignedTo,
          created_by_name: ticket.createdByName,
          created_by_surname: ticket.createdBySurname,
          created_by_department: ticket.createdByDepartment,
          created_at: ticket.createdAt,
          ip_address: ticket.ipAddress,
          rejection_comment: ticket.rejectionComment
        });
      
      if (error) {
        console.error('Error adding ticket to Supabase:', error);
      } else {
        console.log('Ticket added successfully');
        // The real-time subscription in ReportPanel will handle the update
      }
    } catch (error) {
      console.error('Error adding ticket to Supabase:', error);
    }
  },

  // Update a ticket in Supabase
  updateTicket: async (updatedTicket: Ticket): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          title: updatedTicket.title,
          description: updatedTicket.description,
          status: updatedTicket.status,
          priority: updatedTicket.priority,
          assigned_to: updatedTicket.assignedTo,
          created_by_name: updatedTicket.createdByName,
          created_by_surname: updatedTicket.createdBySurname,
          created_by_department: updatedTicket.createdByDepartment,
          ip_address: updatedTicket.ipAddress,
          rejection_comment: updatedTicket.rejectionComment
        })
        .eq('id', updatedTicket.id);
      
      if (error) {
        console.error('Error updating ticket in Supabase:', error);
      } else {
        console.log('Ticket updated successfully');
        // The real-time subscription in ReportPanel will handle the update
      }
    } catch (error) {
      console.error('Error updating ticket in Supabase:', error);
    }
  },

  // Delete a ticket from Supabase
  deleteTicket: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting ticket from Supabase:', error);
      } else {
        console.log('Ticket deleted successfully');
        // The real-time subscription in ReportPanel will handle the update
      }
    } catch (error) {
      console.error('Error deleting ticket from Supabase:', error);
    }
  },

  // Remove tickets older than 7 days
  cleanupOldTickets: async (): Promise<void> => {
    try {
      const now = getIstanbulTime();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error, count } = await supabase
        .from('tickets')
        .delete()
        .lt('created_at', sevenDaysAgo)
        .select('count');
      
      if (error) {
        console.error('Error removing old tickets from Supabase:', error);
      } else if (count) {
        console.log(`Removed ${count} tickets older than 7 days`);
      }
    } catch (error) {
      console.error('Error cleaning up old tickets:', error);
    }
  }
};

export const generateMockTickets = (): Ticket[] => {
  // Boş bir dizi döndürerek otomatik ticket oluşturmayı durduruyoruz
  return [];
};

// Eski users dizisi - sadece yedek olarak tutuyoruz, artık kullanılmayacak
export const users: User[] = [
  {
    id: '1',
    username: 'admin_user',
    password: 'admin',
    role: 'admin',
    displayName: 'Admin User'
  }
  // Diğer kullanıcılar kaldırıldı, artık Supabase'den gelecek
];
