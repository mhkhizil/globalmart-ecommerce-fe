export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  capacity: number;
  registeredCount: number;
}
