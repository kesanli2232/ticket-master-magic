
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
  const mockTickets: Ticket[] = [];
  
  const titles = [
    'İnsan Kaynakları birimindeki yazıcı çalışmıyor',
    'E-Belediye portalına giriş sorunu',
    'Fen İşleri ofisinde su sızıntısı',
    'Destek Hizmetleri biriminde internet bağlantı sorunu',
    'Evrak işleme gecikmesi'
  ];
  
  const descriptions = [
    'Ana yazıcı bir hata kodu gösteriyor ve hiçbir belge yazdırmıyor.',
    'Kullanıcılar sabahtan beri E-Belediye portalına giriş yapamıyor.',
    'Tavandan su sızıntısı var ve acil müdahale gerekiyor.',
    'İnternet bağlantısı kesintili ve günlük işlemleri etkiliyor.',
    'Belgeler sistemde işlenmesi çok uzun sürüyor.'
  ];
  
  const names = ['Ali', 'Ayşe', 'Mehmet', 'Fatma', 'Mustafa'];
  const surnames = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin'];
  
  for (let i = 1; i <= 10; i++) {
    const titleIndex = Math.floor(Math.random() * titles.length);
    const descIndex = Math.floor(Math.random() * descriptions.length);
    const nameIndex = Math.floor(Math.random() * names.length);
    const surnameIndex = Math.floor(Math.random() * surnames.length);
    const deptIndex = Math.floor(Math.random() * departments.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);
    
    const randomCategory = categories[categoryIndex];
    let randomPriority: Priority;
    
    // "Yazıcı Sorunu" kategorisi için otomatik olarak "Çok Önemli" önceliği atama
    if (randomCategory === 'Yazıcı Sorunu') {
      randomPriority = 'Çok Önemli';
    } else {
      const priorityIndex = Math.floor(Math.random() * priorities.length);
      randomPriority = priorities[priorityIndex];
    }
    
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const assigneeIndex = Math.floor(Math.random() * assignees.length);
    
    // Son 30 gün içinde rastgele bir tarih oluşturma
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    mockTickets.push({
      id: `ticket-${i}`,
      title: titles[titleIndex],
      description: descriptions[descIndex],
      status: statuses[statusIndex],
      priority: randomPriority,
      assignedTo: assignees[assigneeIndex],
      category: randomCategory,
      createdByName: names[nameIndex],
      createdBySurname: surnames[surnameIndex],
      createdByDepartment: departments[deptIndex],
      createdAt: date.toISOString()
    });
  }
  
  return mockTickets;
};

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};
