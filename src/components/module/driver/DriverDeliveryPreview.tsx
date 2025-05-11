import { MapPin, Navigation, Package, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useGetDriverOrderList } from '@/lib/hooks/service/order/useGetDriverOrderList';

// Define a mapping for order status numbers to display states
const ORDER_STATUS_MAP: Record<
  number,
  'preparing' | 'ready' | 'sending' | 'completed'
> = {
  1: 'preparing', // 1 => order is preparing
  2: 'ready', // 2 => delivery is preparing
  3: 'sending', // 3 => delivery is sending
  4: 'completed', // 4 => customer Accepted order
};

// Get status text for display based on status number
const getStatusText = (statusNumber: number, t: any): string => {
  const status = ORDER_STATUS_MAP[statusNumber] || 'preparing';

  if (status === 'preparing') return t('driver.orderPreparing');
  if (status === 'ready') return t('driver.readyForPickup');
  if (status === 'sending') return t('driver.sendingToCustomer');
  return t('driver.delivered');
};

interface DriverDeliveryPreviewProps {
  driverId: number;
}

const DriverDeliveryPreview: React.FC<DriverDeliveryPreviewProps> = ({
  driverId,
}) => {
  const t = useTranslations();
  // Pagination state
  const [page, setPage] = useState(1);
  const PER_PAGE = 5; // Show only 5 records as requested

  // Use the hook to fetch data
  const { data, isLoading, isError, refetch } = useGetDriverOrderList({
    driver_id: driverId,
    page,
    per_page: PER_PAGE,
    // Optional: delivery_status filter can be added if needed
  });

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  // Extract delivery items from response
  const deliveries = data?.order_items || [];

  return (
    <div className="rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          {t('driver.myDeliveries')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-orange-500 hover:text-orange-700 focus:outline-none p-1 rounded transition-colors"
            aria-label={t('common.refresh')}
          >
            <RefreshCw
              size={18}
              className={`${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
          <Link
            href="/application/driver-order-list"
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            {t('common.viewAll')}
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">{t('driver.loadingDeliveries')}</p>
          <div className="animate-pulse flex justify-center">
            <div className="h-4 w-4 bg-orange-500 rounded-full mx-1"></div>
            <div className="h-4 w-4 bg-orange-500 rounded-full mx-1 animation-delay-200"></div>
            <div className="h-4 w-4 bg-orange-500 rounded-full mx-1 animation-delay-400"></div>
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 rounded-lg p-8 text-center">
          <p className="text-red-500 mb-4">
            {t('driver.failedToLoadDeliveries')}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      )}

      {!isLoading && !isError && deliveries.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {t('driver.noDeliveriesAvailable')}
          </p>
          <button
            onClick={handleRefresh}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm"
          >
            {t('common.refresh')}
          </button>
        </div>
      )}

      {!isLoading && !isError && deliveries.length > 0 && (
        <div className="space-y-4 h-[30dvh] overflow-y-auto">
          {deliveries.map(delivery => {
            // Map the API response to our UI format
            const status =
              ORDER_STATUS_MAP[delivery.delivery_status] || 'preparing';

            return (
              <div
                key={delivery.order_id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <span className="font-medium">#{delivery.order_no}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      status === 'preparing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : status === 'sending'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {getStatusText(delivery.delivery_status, t)}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <Package size={16} className="mt-1 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-700">
                        {delivery.merchant_name}
                      </p>
                      <p>
                        {t('driver.orderNumber', {
                          number: delivery.voucher_no,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={16} className="mt-1 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-700">
                        {delivery.driver_name}
                      </p>
                      <p>{delivery.driver_contact_number}</p>
                    </div>
                  </div> */}

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Navigation size={16} className="mt-1 text-orange-500" />
                    <div>
                      <p>
                        <span className="font-medium text-gray-700">
                          {t('driver.orderTotal')}: {delivery.order_total}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/application/driver-order-detail/${delivery.order_id}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                  >
                    {status === 'preparing' || status === 'ready'
                      ? t('driver.startDelivery')
                      : t('driver.viewDetails')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverDeliveryPreview;
