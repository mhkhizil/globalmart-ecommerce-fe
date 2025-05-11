export interface Event {
  id: number;
  title: string;
  image: string;
  detail: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface EventList {
  events: Event[];
}
