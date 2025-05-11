import DriverOrderDetail from '@/components/module/driver/DriverOrderDetail';

interface IOrderProps {
  id: string;
}
function DriverOrderDetailPageClient(props: IOrderProps) {
  return <DriverOrderDetail id={props.id} />;
}
export default DriverOrderDetailPageClient;
