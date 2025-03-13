
import { User, Ticket, Department, Category, Status, Priority, AssignedTo } from '@/types';

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin'
  },
  {
    id: '2',
    username: 'viewer',
    password: 'viewer123', // In a real app, this would be hashed
    role: 'viewer'
  }
];

export const departments: Department[] = [
  'Disaster Affairs',
  'Information Technology',
  'Support Services',
  'Real Estate Expropriation',
  'Public Works',
  'Legal Affairs',
  'Climate Change Zero Waste',
  'Zoning and Urbanism',
  'Human Resources and Training',
  'Fire Department',
  'Culture and Social Affairs',
  'Machinery Maintenance and Repair',
  'Financial Services',
  'Parks and Gardens',
  'Social Support Services',
  'Water and Sewage',
  'Cleaning Services',
  'Veterinary Affairs',
  'Writing Affairs',
  'Municipal Police'
];

export const categories: Category[] = [
  'Municipality',
  'Printer Issue',
  'E-Municipality Issue',
  'Other'
];

export const statuses: Status[] = ['Open', 'Solved'];

export const priorities: Priority[] = [
  'Very Important',
  'Important',
  'Secondary'
];

export const assignees: AssignedTo[] = ['Emir', 'Ahmet', 'Atakan', 'Görkem'];

export const generateMockTickets = (): Ticket[] => {
  const mockTickets: Ticket[] = [];
  
  const titles = [
    'Printer not working in HR department',
    'E-Municipality portal login issue',
    'Water leak in Public Works office',
    'Internet connection problem in Support Services',
    'Document processing delay'
  ];
  
  const descriptions = [
    'The main printer is showing an error code and not printing any documents.',
    'Users are unable to log in to the E-Municipality portal since the morning.',
    'There is a water leak from the ceiling that needs immediate attention.',
    'The internet connection is intermittent and affecting daily operations.',
    'Documents are taking too long to process in the system.'
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
    
    // Auto-assign "Very Important" priority for "Printer Issue" category
    if (randomCategory === 'Printer Issue') {
      randomPriority = 'Very Important';
    } else {
      const priorityIndex = Math.floor(Math.random() * priorities.length);
      randomPriority = priorities[priorityIndex];
    }
    
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const assigneeIndex = Math.floor(Math.random() * assignees.length);
    
    // Generate a random date within the last 30 days
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
