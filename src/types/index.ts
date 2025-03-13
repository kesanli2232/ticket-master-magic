
export type Role = 'admin' | 'viewer';

export type User = {
  id: string;
  username: string;
  password: string;
  role: Role;
};

export type Status = 'Open' | 'Solved';
export type Priority = 'Very Important' | 'Important' | 'Secondary';
export type AssignedTo = 'Emir' | 'Ahmet' | 'Atakan' | 'Görkem';
export type Category = 'Municipality' | 'Printer Issue' | 'E-Municipality Issue' | 'Other';
export type Department = 
  | 'Disaster Affairs' 
  | 'Information Technology' 
  | 'Support Services'
  | 'Real Estate Expropriation'
  | 'Public Works'
  | 'Legal Affairs'
  | 'Climate Change Zero Waste'
  | 'Zoning and Urbanism'
  | 'Human Resources and Training'
  | 'Fire Department'
  | 'Culture and Social Affairs'
  | 'Machinery Maintenance and Repair'
  | 'Financial Services'
  | 'Parks and Gardens'
  | 'Social Support Services'
  | 'Water and Sewage'
  | 'Cleaning Services'
  | 'Veterinary Affairs'
  | 'Writing Affairs'
  | 'Municipal Police';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignedTo: AssignedTo;
  category: Category;
  createdByName: string;
  createdBySurname: string;
  createdByDepartment: Department;
  createdAt: string;
};

export type TicketFilter = {
  status?: Status;
  priority?: Priority;
  assignedTo?: AssignedTo;
  category?: Category;
};
