import { motion } from 'framer-motion';
import { Clock, DollarSign, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';

import { OrderItem } from '@/core/entity/Order';
import { convertThousandSeparator } from '@/lib/util/ConvertToThousandSeparator';

interface IOrderPreviewProps {
  orderItem: OrderItem;
}

const PriceDisplay: React.FC<{ price: number; discount?: number }> = ({
  price,
  discount,
}) => (
  <div className="flex items-center gap-2">
    <span className="text-orange-500 font-semibold text-lg">
      ${convertThousandSeparator(price, 2)}
    </span>
    {discount && discount > 0 && (
      <span className="text-sm text-green-600 font-medium">
        -${convertThousandSeparator(discount, 2)}
      </span>
    )}
  </div>
);

const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
  // Define type for status objects
  interface StatusMap {
    [key: number]: string;
    1: string;
    2: string;
    3: string;
  }

  const statusStyles: StatusMap = {
    1: 'bg-gray-100 text-gray-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-red-100 text-red-800',
  };

  const statusText: StatusMap = {
    1: 'Pending',
    2: 'Confirmed',
    3: 'Cancelled',
  };

  // Use type assertion or fallback to handle unknown status
  const styleKey = status in statusStyles ? status : 0;
  const textKey = status in statusText ? status : 0;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[styleKey]}`}
    >
      {statusText[textKey]}
    </span>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

const OrderPreviewCard = memo(({ orderItem }: IOrderPreviewProps) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    // router.push(`/application/merchant-orderitem-detail/${orderItem.id}`);
    setTimeout(() => {
      router.push(
        `/application/merchant-orderitem-detail/${orderItem.order_id}`
      );
    }, 400);
  }, [router, orderItem.order_id]);

  const cardVariants = {
    hover: { scale: 1.02, transition: { duration: 0.01 } },
    tap: { scale: 0.5, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      className="w-full bg-white rounded-md shadow-md border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:border-orange-200"
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {orderItem.voucher_no}
            </h3>
            <p className="text-sm text-gray-600">{orderItem.order_no}</p>
          </div>
          <StatusBadge status={orderItem.status} />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{orderItem.order_date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              <span>{orderItem.shop_name || '--'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2 text-right">
            <PriceDisplay
              price={Number.parseFloat(orderItem.order_total)}
              discount={orderItem.discount_amt}
            />
            <div className="text-sm text-gray-600">
              <span>
                {orderItem.quantity} item{orderItem.quantity > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        {orderItem.driver_name && (
          <div className="mt-3 pt-2 border-t border-gray-100 text-sm text-gray-600">
            Driver: {orderItem.driver_name}
            {orderItem.driver_contact_number &&
              ` (${orderItem.driver_contact_number})`}
          </div>
        )}
      </div>

      {/* Product Name Ribbon */}
      <div className="bg-orange-50 px-4 py-1 text-sm text-orange-800 truncate">
        {orderItem.name}
      </div>
    </motion.div>
  );
});

OrderPreviewCard.displayName = 'OrderPreviewCard';

export default OrderPreviewCard;
