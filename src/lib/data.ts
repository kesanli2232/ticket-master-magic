
import { User, Ticket, Department, Category, Status, Priority, AssignedTo } from '@/types';

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

export const categories: Category[] = [
  'Belediye',
  'Yazıcı Sorunu',
  'E-Belediye Sorunu',
  'Diğer'
];

export const statuses: Status[] = ['Açık', 'Çözüldü'];

export const priorities: Priority[] = [
  'Çok Önemli',
  'Önemli',
  'İkincil'
];

export const assignees: AssignedTo[] = ['Emir', 'Ahmet', 'Atakan', 'Görkem'];

export const generateMockTickets = (): Ticket[] => {
  // Boş bir dizi döndürerek otomatik ticket oluşturmayı durduruyoruz
  return [];
};

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};
