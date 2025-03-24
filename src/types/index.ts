
export type Role = 'admin' | 'viewer';

export type User = {
  id: string;
  username: string;
  password: string;
  role: Role;
  displayName?: string; // Adding optional displayName property
};

export type Status = 'Açık' | 'İşlemde' | 'Çözüldü' | 'Çözülemedi';
export type Priority = 'Çok Önemli' | 'Önemli' | 'İkincil';
export type AssignedTo = 'Emir' | 'Ahmet' | 'Atakan' | 'Görkem';
export type Department = 
  | 'Afet İşleri Müdürlüğü' 
  | 'Bilgi İşlem Müdürlüğü' 
  | 'Destek Hizmetleri Müdürlüğü'
  | 'Emlak İstimlak Müdürlüğü'
  | 'Fen İşleri Müdürlüğü'
  | 'Hukuk İşleri Müdürlüğü'
  | 'İklim Değişikliği Sıfır Atık Müdürlüğü'
  | 'İmar ve Şehircilik Müdürlüğü'
  | 'İnsan Kaynakları ve Eğitim Müdürlüğü'
  | 'İtfaiye Müdürlüğü'
  | 'Kültür ve Sosyal İşler Müdürlüğü'
  | 'Makine İkmal Bakım ve Onarım Müdürlüğü'
  | 'Mali Hizmetler Müdürlüğü'
  | 'Park Bahçeler Müdürlüğü'
  | 'Sosyal Destek Hizmetleri Müdürlüğü'
  | 'Su ve Kanalizasyon Müdürlüğü'
  | 'Temizlik İşleri Müdürlüğü'
  | 'Veteriner İşleri Müdürlüğü'
  | 'Yazı İşleri Müdürlüğü'
  | 'Zabıta Müdürlüğü';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignedTo: AssignedTo;
  createdByName: string;
  createdBySurname: string;
  createdByDepartment: Department;
  createdAt: string;
  ipAddress?: string;
  rejectionComment?: string; // Bu alan "Çözülemedi" durumu için yorum alanı
};

export type TicketFilter = {
  status?: Status;
  priority?: Priority;
  assignedTo?: AssignedTo;
};
