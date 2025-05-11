import UserOrderDetail from '@/components/module/user-order-detail/UserOrderDetail';
import { Order } from '@/core/entity/Order';

interface IUserOrderDetailPageClientProps {
  id: string;
}

function UserOrderDetailPageClient(props: IUserOrderDetailPageClientProps) {
  return <UserOrderDetail id={props.id} />;
}
export default UserOrderDetailPageClient;
