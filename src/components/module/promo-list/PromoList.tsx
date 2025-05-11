'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPromoList } from '@/lib/hooks/service/promotion/useGetPromoList';

type PromotionItem = {
  id: number;
  m_id: number;
  s_id: number;
  p_id: number;
  name: string;
  en_description: string;
  mm_description: string;
  th_description: string;
  cn_description: string;
  start_date: string;
  end_date: string;
  level: string;
  status: string;
  created_at: string;
  updated_at: string;
  type: 'promo' | 'ads' | 'text';
  image: string;
};

// Placeholder types for Orders and Transactions (to be replaced with actual DTOs later)
type OrderItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  items: number;
};

type TransactionItem = {
  id: string;
  transactionId: string;
  date: string;
  amount: number;
  type: 'payment' | 'refund';
  status: 'successful' | 'pending' | 'failed';
  method: string;
};

// Mock data for Orders and Transactions (to be replaced with actual API calls)
const mockOrders: OrderItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: `order-${index}`,
  orderNumber: `ORD-${1000 + index}`,
  customerName: `Customer ${index + 1}`,
  orderDate: new Date(Date.now() - index * 86_400_000).toISOString(),
  status: ['pending', 'completed', 'cancelled'][
    index % 3
  ] as OrderItem['status'],
  totalAmount: Math.round(Math.random() * 1000 + 50),
  items: Math.floor(Math.random() * 10) + 1,
}));

const mockTransactions: TransactionItem[] = Array.from(
  { length: 10 },
  (_, index) => {
    // Explicitly define the transaction type to avoid type issues
    const transactionType: 'payment' | 'refund' =
      index % 3 === 0 ? 'refund' : 'payment';

    return {
      id: `transaction-${index}`,
      transactionId: `TXN-${2000 + index}`,
      date: new Date(Date.now() - index * 86_400_000).toISOString(),
      amount: Math.round(Math.random() * 1000 + 50),
      type: transactionType,
      status: ['successful', 'pending', 'failed'][
        index % 3
      ] as TransactionItem['status'],
      method: ['Credit Card', 'Bank Transfer', 'Cash'][index % 3],
    };
  }
);

function PromoList() {
  // Using the hook to fetch only text type promotions
  const {
    data: promoList,
    isLoading,
    error,
  } = useGetPromoList({ type: 'text' });

  // Animation variants for all scrollable sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Generic error component for any section that fails to load
  const renderError = (message: string) => (
    <div className="flex items-center justify-center p-4 min-h-[200px]">
      <Card className="w-full max-w-md bg-red-50 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-600 text-lg">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{message}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col space-y-8 p-4 md:p-6 overflow-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your latest promotions, orders, and transactions
        </p>
      </div>

      {/* Promotions Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Promotions
            {promoList?.promotion && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-50 text-green-700 border-green-200"
              >
                {promoList.promotion.length}
              </Badge>
            )}
          </h2>
          {/* <Link
            href="/promotions"
            className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
          >
            View All
          </Link> */}
        </div>
        {error ? (
          renderError('Failed to load promotions. Please try again later.')
        ) : (
          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-12  z-10"></div>
            <div className="overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex space-x-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <PromotionCardSkeleton key={index} />
                  ))}
                </div>
              ) : !promoList?.promotion || promoList.promotion.length <= 0 ? (
                <Card className="w-full max-w-md bg-gray-50 border-gray-200">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-gray-600 font-medium">
                      No announcements available
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Check back later for updates
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <motion.div
                  className="flex space-x-4 "
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {promoList.promotion.map(item => (
                      <PromotionCard
                        key={item.id}
                        item={item}
                        variants={itemVariants}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Orders Section */}
      {/* <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Recent Orders
            <Badge
              variant="outline"
              className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
            >
              {mockOrders.length}
            </Badge>
          </h2>
          <Link
            href="/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10"></div>
          <div className="overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <motion.div
              className="flex space-x-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {mockOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    variants={itemVariants}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Transactions Section */}
      {/* <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Latest Transactions
            <Badge
              variant="outline"
              className="ml-2 bg-purple-50 text-purple-700 border-purple-200"
            >
              {mockTransactions.length}
            </Badge>
          </h2>
          <Link
            href="/transactions"
            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="relative">
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10"></div>
          <div className="overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <motion.div
              className="flex space-x-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {mockTransactions.map(transaction => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    variants={itemVariants}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

// Card components for each section
function PromotionCard({
  item,
  variants,
}: {
  item: PromotionItem;
  variants: any;
}) {
  return (
    <motion.div
      variants={variants}
      layout
      exit={{ opacity: 0, x: -20 }}
      className="w-72 flex-shrink-0"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 border-green-100">
        {item.image && (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
              Announcement
            </span>
          </div>
        )}
        <CardHeader className={item.image ? 'pb-1 pt-3' : 'pb-1 pt-3'}>
          <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
          <div className="flex items-center text-xs text-gray-500">
            <span>
              {new Date(item.start_date).toLocaleDateString()} -{' '}
              {new Date(item.end_date).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow py-2">
          <CardDescription className="text-xs line-clamp-2">
            {item.en_description}
          </CardDescription>
        </CardContent>
        <CardFooter className="pt-1 pb-2 border-t">
          <Link
            href={`/application/product/detail/${item.p_id}`}
            className="text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
          >
            View Details →
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function OrderCard({ order, variants }: { order: OrderItem; variants: any }) {
  return (
    <motion.div
      variants={variants}
      layout
      exit={{ opacity: 0, x: -20 }}
      className="w-80 flex-shrink-0"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 border-blue-100">
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base line-clamp-1">
              {order.orderNumber}
            </CardTitle>
            <Badge
              className={`
                ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                }
              `}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{order.customerName}</p>
              <p className="text-xs text-gray-500">{order.items} items</p>
            </div>
            <p className="text-base font-bold">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-1 pb-2 border-t">
          <Link
            href={`/orders/${order.id}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Order Details →
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function TransactionCard({
  transaction,
  variants,
}: {
  transaction: TransactionItem;
  variants: any;
}) {
  // Precompute all styles and text based on transaction properties
  const renderAmount = () => {
    return transaction.type === 'refund' ? (
      <p className="text-base font-bold text-red-600">
        -${transaction.amount.toFixed(2)}
      </p>
    ) : (
      <p className="text-base font-bold text-green-600">
        +${transaction.amount.toFixed(2)}
      </p>
    );
  };

  const renderStatusBadge = () => {
    if (transaction.status === 'successful') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Successful
        </Badge>
      );
    } else if (transaction.status === 'failed') {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
      );
    } else {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          Pending
        </Badge>
      );
    }
  };

  return (
    <motion.div
      variants={variants}
      layout
      exit={{ opacity: 0, x: -20 }}
      className="w-72 flex-shrink-0"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 border-purple-100">
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base line-clamp-1">
              {transaction.transactionId}
            </CardTitle>
            {renderStatusBadge()}
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">{transaction.method}</p>
              <p className="text-xs text-gray-500 capitalize">
                {transaction.type}
              </p>
            </div>
            {renderAmount()}
          </div>
        </CardContent>
        <CardFooter className="pt-1 pb-2 border-t">
          <Link
            href={`/transactions/${transaction.id}`}
            className="text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            View Transaction →
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function PromotionCardSkeleton() {
  return (
    <div className="w-72 flex-shrink-0">
      <Card className="h-full overflow-hidden">
        <div className="aspect-video w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader className="pb-1 pt-3">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/3" />
        </CardHeader>
        <CardContent className="py-2">
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-5/6" />
        </CardContent>
        <CardFooter className="pt-1 pb-2 border-t">
          <Skeleton className="h-3 w-20" />
        </CardFooter>
      </Card>
    </div>
  );
}

export default PromoList;
