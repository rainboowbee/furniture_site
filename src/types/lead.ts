export interface Lead {
  id: string;
  name: string;
  phone: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
