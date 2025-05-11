'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Filter,
  History,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TransactionListRequestDto,
  TransactionListResponseDto,
} from '@/core/dtos/payment/wallet/WalletDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

// Constants
const TRANSACTIONS_PER_PAGE = 2; // Small for testing
const OBSERVER_THRESHOLD = 0.1;

// Types for transaction status
enum TransactionStatus {
  PENDING = 1,
  COMPLETED = 2,
  REJECTED = 3,
}

// Type for transaction
type Transaction = {
  id: number;
  payment_id: number;
  user_id: number;
  wallet_amount: string;
  remark: string;
  image: string;
  status: number;
  created_at: string;
  updated_at: string;
  account_no: string;
  account_name: string;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// Format date helper
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

// Transaction Item Component
function TransactionItem({ transaction }: { transaction: Transaction }) {
  if (!transaction) {
    return (
      <Card className="mb-3 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="text-red-600">Invalid transaction data</div>
        </CardContent>
      </Card>
    );
  }

  // Parse amount
  const amount = transaction.wallet_amount
    ? Number.parseFloat(transaction.wallet_amount)
    : 0;
  const isCredit = amount > 0;
  const formattedDate = formatDate(transaction.created_at);

  // Get status badge
  const getStatusBadge = () => {
    switch (transaction.status) {
      case TransactionStatus.PENDING: {
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      }
      case TransactionStatus.COMPLETED: {
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      }
      case TransactionStatus.REJECTED: {
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      }
      default: {
        return <Badge variant="outline">Unknown ({transaction.status})</Badge>;
      }
    }
  };

  return (
    <motion.div variants={itemVariants} layout className="w-full">
      <Card className="mb-3 overflow-hidden border-neutral-100 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {isCredit ? (
                  <div className="p-2 rounded-full bg-green-50">
                    <ArrowDownCircle className="h-6 w-6 text-green-500" />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-red-50">
                    <ArrowUpCircle className="h-6 w-6 text-red-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-neutral-800">
                  {transaction.remark ||
                    (isCredit ? 'Wallet Top Up' : 'Payment')}
                </span>
                <div className="flex items-center mt-1 text-xs text-neutral-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formattedDate}
                </div>
                <div className="flex items-center mt-1 text-xs text-neutral-600">
                  <span className="text-neutral-500 mr-2">Account:</span>
                  {transaction.account_name || 'N/A'} (
                  {transaction.account_no || 'N/A'})
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  ID: {transaction.id}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-semibold ${
                  isCredit ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isCredit ? '+' : '-'} ${Math.abs(amount).toFixed(2)}
              </span>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Types for transaction hook
interface UseTransactionListReturn {
  transactions: Transaction[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | undefined;
  fetchNextPage: () => void;
}

// Custom hook for transaction list with pagination
const useTransactionList = (): UseTransactionListReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);

  // Create service instance
  const paymentService = useMemo(
    () => new PaymentService(new PaymentRepository(new AxiosCustomClient())),
    []
  );

  // Fetch transactions function
  const fetchTransactions = useCallback(
    async ({
      page,
      perPage,
      signal,
    }: {
      page: number;
      perPage: number;
      signal: AbortSignal;
    }) => {
      try {
        setIsLoading(true);
        setError(undefined);

        const requestDto: TransactionListRequestDto = {
          page,
          per_page: perPage,
        };

        const response = await paymentService.getTransactionList(requestDto);

        if (!response || !response.transactions) {
          throw new Error('Invalid response format from API');
        }

        // Update transactions state
        setTransactions(previous =>
          page === 1
            ? response.transactions
            : [...previous, ...response.transactions]
        );

        // Check if there are more transactions to load
        setHasMore(response.transactions.length >= perPage);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching transactions:', error);
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to fetch transactions'
          );
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [paymentService]
  );

  // Initial fetch and page changes
  useEffect(() => {
    const controller = new AbortController();
    fetchTransactions({
      page,
      perPage: TRANSACTIONS_PER_PAGE,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [page, fetchTransactions]);

  // Function to load next page
  const fetchNextPage = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(previous => previous + 1);
    }
  }, [hasMore, isLoading]);

  return {
    transactions,
    isLoading,
    hasMore,
    error,
    fetchNextPage,
  };
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-4">
    <div className="h-5 w-5 border-t-2 border-neutral-500 rounded-full animate-spin" />
    <span className="ml-2 text-sm text-neutral-500">Loading...</span>
  </div>
);

// Main Transaction History List Component
function TransactionHistoryList() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const { transactions, isLoading, hasMore, error, fetchNextPage } =
    useTransactionList();

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!globalThis.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNextPage();
        }
      },
      { threshold: OBSERVER_THRESHOLD }
    );

    const target = observerRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, isLoading, fetchNextPage]);

  // Initial loading state
  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="mb-3 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="bg-neutral-50 p-4 rounded-full mb-4">
          <History className="h-12 w-12 text-neutral-400" />
        </div>
        <h3 className="text-xl font-medium text-neutral-800 mb-2">
          No Transactions Yet
        </h3>
        <p className="text-neutral-500 max-w-sm">
          Your transaction history will appear here once you start making
          payments or receiving funds.
        </p>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-red-800 mb-2">
          Error Loading Transactions
        </h3>
        <p className="text-red-600 max-w-md mb-4">{error}</p>
      </motion.div>
    );
  }

  // Render transaction list
  return (
    <div className="w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {transactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Observer element for infinite scrolling */}
      {hasMore && (
        <div ref={observerRef} className="py-4 flex justify-center">
          {isLoading ? <LoadingSpinner /> : undefined}
        </div>
      )}
    </div>
  );
}

// Main Transaction History Component
function TransactionHistory() {
  return (
    <div className="flex flex-col h-[93dvh]">
      <div className="sticky top-0 z-10 bg-white p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-neutral-600" />
            <h1 className="text-xl font-semibold text-neutral-800">
              Transaction History
            </h1>
          </div>
          {/* <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button> */}
        </div>
      </div>

      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <TransactionHistoryList />
      </div>
    </div>
  );
}

export default TransactionHistory;
