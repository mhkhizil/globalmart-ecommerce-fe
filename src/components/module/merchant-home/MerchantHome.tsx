import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUpCircle,
  CalendarDays,
  ChevronDown,
  Loader2,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWeeklyChartData } from '@/lib/hooks/service/merchant/useGetWeeklyChartData';
import { useGetOrderListCount } from '@/lib/hooks/service/order/useGetOrderListCount';
import { useGetCustomerWallet } from '@/lib/hooks/service/payment/useGetCustomerWallet';
import { useSession } from '@/lib/hooks/session/useSession';

import MerchantOrderList from '../merchant-order/list/MerchantOrderList';
import OrderNotiBell from '../merchant-order/OrderNotiBell';
import MerchantProductPreviewList from '../merchant-profile/Merchant-profile-detail/MerchantProductPreviewList';
import MerchantShopPreviewList from '../merchant-profile/Merchant-profile-detail/MerchantShopPreviewList';

// Register Chart.js components, including CategoryScale
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface MerchantHomeProps {
  merchant_id: number;
}

// Assuming OrderCount data might include order_items or similar structure
interface OrderCountData {
  count: number;
  order_items?: { id: number; name: string; quantity: number }[] | null; // Example structure
}

const MerchantHome: React.FC<MerchantHomeProps> = ({ merchant_id }) => {
  const t = useTranslations();
  const router = useRouter();

  // Fetch running orders (status: 1) and completed orders (status: 2) counts
  const { data: runningOrdersData } = useGetOrderListCount(
    {
      merchant_id,
      status: 2,
    },
    {
      staleTime: 30_000, // Cache for 30 seconds to reduce re-fetching
      refetchOnWindowFocus: false, // Prevent refetch on window focus for better performance
    }
  );

  const { data: orderRequestsData } = useGetOrderListCount(
    {
      merchant_id,
      status: 1,
    },
    {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: weeklyChartData,
    isLoading: isChartLoading,
    isError: isChartError,
  } = useGetWeeklyChartData(
    {
      merchant_id,
    },
    {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }
  );

  // Generate chart data from API response
  const chartData = useMemo(() => {
    // Check if we have valid data structure
    const dailyData = weeklyChartData?.dailyData || [];
    const hasData = dailyData.length > 0;

    if (!hasData) {
      // Fallback data when API data is not available
      return {
        labels: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        datasets: [
          {
            label: 'Revenue',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgba(255, 159, 64, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    return {
      // Map dates to day names for better readability
      labels: dailyData.map(item => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: dailyData.map(item => item.revenue),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'rgba(255, 159, 64, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [weeklyChartData]);

  // Calculate if we have valid revenue data to show
  const hasValidRevenueData = useMemo(() => {
    return (
      weeklyChartData &&
      weeklyChartData.dailyData &&
      weeklyChartData.dailyData.some(item => item.revenue > 0)
    );
  }, [weeklyChartData]);

  // Safe extraction of revenue summary data
  const totalRevenue = weeklyChartData?.data?.summary?.totalRevenue || 0;
  const currency = weeklyChartData?.data?.summary?.currency || '$';
  const period = weeklyChartData?.data?.summary?.period || '';

  // Enhanced chart options with tooltips
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111',
        bodyColor: '#333',
        bodyFont: { weight: 'bold' },
        borderColor: 'rgba(255, 159, 64, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: items => {
            return items[0].label || '';
          },
          label: context => {
            const value = context.raw === undefined ? 0 : context.raw;
            return `${currency}${value}`;
          },
          afterLabel: context => {
            const index = context.dataIndex;
            const dailyData = weeklyChartData?.dailyData || [];
            if (dailyData.length > index) {
              return `Orders: ${dailyData[index].orderCount}`;
            }
            return 'Orders: 0';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: number | string) => {
            return `${currency}${tickValue}`;
          },
          font: {
            size: 10,
          },
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        type: 'category',
        grid: { display: false },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 4,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const { data: sessionData } = useSession();
  const [address, setAddress] = useState<any>();
  useEffect(() => {
    if ('geolocation' in navigator && !address) {
      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        setAddress(data);
      });
    }
  }, [address, setAddress]);

  // Fetch wallet data
  const { data: walletData, isLoading: isWalletLoading } = useGetCustomerWallet(
    sessionData?.user?.id?.toString() || '',
    {
      enabled: !!sessionData?.user?.id,
      staleTime: 60_000, // Cache for 1 minute
      refetchOnWindowFocus: true,
    }
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50 font-sans">
      <motion.div
        className="w-full mx-auto bg-white shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <motion.div variants={itemVariants}>
            <div className="flex gap-x-1">
              <span className="text-orange-700">
                {t('merchantHome.location')}
              </span>
              <ChevronDown stroke="#c2410c" />
            </div>
            <div className="flex flex-col">
              {address && (
                <>
                  {/* <span className="text-black text-[0.9rem]  font-[500]">
                    {`${address?.address?.quarter}, ${address?.address?.suburb}`}
                  </span> */}
                  <span className="text-black text-[0.7rem]  font-[400]">
                    {`${address?.address?.city}, ${address?.address?.country}`}
                  </span>
                </>
              )}
              {!address && <span>--</span>}
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3"
          >
            <OrderNotiBell bellColor="grey" />
            <Avatar>
              <AvatarImage src={sessionData?.user?.image} />
              <AvatarFallback>
                {sessionData?.user?.name.toString().slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>

        {/* Wallet Balance Section - NEW */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-6 shadow-md border border-orange-200 overflow-hidden relative"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-medium text-gray-800">
                {t('merchantHome.walletBalance')}
              </h3>
            </div>

            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="z-10"
            >
              <Button
                onClick={() =>
                  router.push('/application/customer-wallet-refill')
                }
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm"
              >
                <ArrowUpCircle className="h-4 w-4" />
                {t('merchantHome.refill')}
              </Button>
            </motion.div> */}
          </div>

          <div className="relative z-10">
            {isWalletLoading ? (
              <div className="flex items-center space-x-2 h-16">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="text-gray-500">
                  {t('merchantHome.loadingBalance')}
                </span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col"
              >
                <div className="flex items-baseline">
                  <motion.span
                    className="text-3xl font-bold text-gray-900"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    ${Number(walletData?.wallet_amount).toFixed(2) || '0.00'}
                  </motion.span>
                  <span className="text-gray-500 ml-2 text-sm">
                    {t('merchantHome.availableBalance')}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {t('merchantHome.walletDescription')}
                </p>
                <Link
                  href="/application/merchant-withdraw-history"
                  className="text-blue-500 underline text-sm mt-1"
                >
                  {t('merchantHome.withdrawHistory')}
                </Link>
              </motion.div>
            )}
          </div>

          {/* Decorative element */}
          {/* <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
            <svg
              width="150"
              height="150"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 14C2 16.2091 3.79086 18 6 18H18C20.2091 18 22 16.2091 22 14V10C22 7.79086 20.2091 6 18 6H6C3.79086 6 2 7.79086 2 10V14Z"
                stroke="#FE8C00"
                strokeWidth="2"
              />
              <path d="M2 12H22" stroke="#FE8C00" strokeWidth="2" />
              <path
                d="M18 14H18.01"
                stroke="#FE8C00"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div> */}
        </motion.div>

        {/* Orders and Requests Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Drawer>
            <DrawerTrigger asChild>
              <motion.div
                variants={itemVariants}
                className="bg-orange-50 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-100 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-3xl font-bold text-orange-600">
                  {runningOrdersData?.toString().padStart(2, '0') ?? '00'}
                </h3>
                <p className="text-gray-600 font-bold font-poppins text-[1.3rem]">
                  {t('merchantHome.runningOrders')}
                </p>
              </motion.div>
            </DrawerTrigger>
            <DrawerContent className="min-h-[60dvh] h-[60dvh]">
              <DrawerTitle className="flex w-full items-center justify-center pb-2">
                {`${t('merchantHome.runningList')} (${runningOrdersData?.toString().padStart(2, '0') ?? '00'})`}
              </DrawerTitle>
              <MerchantOrderList
                status={2}
                userId={merchant_id}
                showFilter={false}
              />
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger asChild>
              <motion.div
                variants={itemVariants}
                className="bg-blue-50 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-100 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-3xl font-bold text-blue-600">
                  {orderRequestsData?.toString().padStart(2, '0') ?? '00'}
                </h3>
                <p className="text-gray-600 font-bold font-poppins text-[1.3rem]">
                  {t('merchantHome.orderRequests')}
                </p>
              </motion.div>
            </DrawerTrigger>
            <DrawerContent className="min-h-[60dvh] h-[60dvh]">
              <DrawerTitle className="flex w-full items-center justify-center pb-2">
                {`${t('merchantHome.requestList')} (${orderRequestsData?.toString().padStart(2, '0') ?? '00'})`}
              </DrawerTitle>
              <MerchantOrderList
                status={1}
                userId={merchant_id}
                showFilter={false}
              />
            </DrawerContent>
          </Drawer>
        </div>

        {/* Delivery Management Section - NEW */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-800">
                {t('merchantHome.deliveryManagement')}
              </h3>
            </div>
          </div>

          <div className="p-2">
            <div className="flex flex-col items-center justify-between bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {t('merchantHome.manageDeliveryDrivers')}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('merchantHome.driverDescription')}
                  </p>
                </div>
              </div>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => router.push('/application/register-driver')}
              >
                {t('merchantHome.registerNewDriver')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Revenue Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 mb-6 shadow-md"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-800">
                {t('merchantHome.totalRevenue')}
              </h3>
              {period && (
                <div className="flex items-center text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                  <CalendarDays size={14} className="mr-1" />
                  <span>{period}</span>
                </div>
              )}
            </div>
            <select className="text-sm text-gray-600 bg-transparent border-none focus:outline-none">
              <option>{t('merchantHome.week')}</option>
            </select>
          </div>

          {isChartLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isChartError ? (
            <div className="text-center py-6 text-gray-500">
              <p>{t('merchantHome.failedToLoadRevenue')}</p>
              <Button
                variant="ghost"
                className="mt-2 text-orange-500"
                onClick={() => globalThis.location.reload()}
              >
                {t('merchantHome.retry')}
              </Button>
            </div>
          ) : hasValidRevenueData ? (
            <>
              <motion.p
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currency}
                {totalRevenue.toLocaleString()}
              </motion.p>
              <motion.div className="h-40" variants={chartVariants}>
                <Line data={chartData} options={chartOptions} />
              </motion.div>
              <motion.button
                className="text-orange-500 text-sm font-medium hover:underline mt-3 flex items-center"
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {t('merchantHome.seeDetails')}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50 transition-all hover:bg-gray-100">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CalendarDays
                  size={36}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p className="mb-2 font-medium">
                  {t('merchantHome.noRevenueData')}
                </p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  {t('merchantHome.revenueDataDescription')}
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-md mb-6"
        >
          <MerchantShopPreviewList merchant_id={merchant_id} />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <MerchantProductPreviewList />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MerchantHome;
