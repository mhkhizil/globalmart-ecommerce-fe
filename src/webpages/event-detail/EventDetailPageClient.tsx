import EventDetail from '@/components/module/event-detail/EventDetail';

interface IOrderProps {
  id: string;
}
function EventDetailPageClient(props: IOrderProps) {
  return <EventDetail id={props.id} />;
}
export default EventDetailPageClient;
