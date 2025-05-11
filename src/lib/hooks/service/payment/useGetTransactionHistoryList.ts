import { useQuery } from '@tanstack/react-query';

import {
  TransactionListRequestDto,
  TransactionListResponseDto,
} from '@/core/dtos/payment/wallet/WalletDto';
import { PaymentRepository } from '@/core/repository/PaymentRepository';
import { PaymentService } from '@/core/services/PaymentService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

// Define minimal interface for the options we want to accept
interface UseTransactionHistoryOptions {
  onSuccess?: (data: TransactionListResponseDto) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  retry?: boolean | number;
  retryDelay?: number | ((retryAttempt: number) => number);
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  keepPreviousData?: boolean;
}

export const useGetTransactionHistoryList = (
  requestDto: TransactionListRequestDto,
  options?: UseTransactionHistoryOptions
) => {
  return useQuery({
    // Update query key to include both page and per_page to ensure proper cache invalidation
    queryKey: [
      'get-transaction-history-list',
      requestDto.page,
      requestDto.per_page,
    ],
    queryFn: async () => {
      const paymentService = new PaymentService(
        new PaymentRepository(new AxiosCustomClient())
      );

      try {
        // Log pagination info for debugging

        // Use consistent naming for better readability
        const apiResponse = await paymentService.getTransactionList(requestDto);

        // Handle different response structures
        if (apiResponse && typeof apiResponse === 'object') {
          // Case 1: Direct transactions array in the response
          if (
            apiResponse.transactions &&
            Array.isArray(apiResponse.transactions)
          ) {
            return apiResponse;
          }

          // Case 2: Nested data structure (common in REST APIs with pagination)
          if ('data' in apiResponse) {
            const nestedData = apiResponse.data as any;
            if (
              nestedData &&
              'transactions' in nestedData &&
              Array.isArray(nestedData.transactions)
            ) {
              return nestedData as TransactionListResponseDto;
            }
          }

          // Case 3: The response itself is the array (uncommon but possible)
          if (Array.isArray(apiResponse)) {
            return { transactions: apiResponse };
          }
        }

        // If we can't find the transactions array, log and return empty array
        console.warn(
          `[Debug] Page ${requestDto.page}: Could not find transactions in API response structure:`,
          apiResponse
        );
        return { transactions: [] };
      } catch (error) {
        console.error(
          `[Debug] Page ${requestDto.page}: Error in transaction list query:`,
          error
        );
        throw error; // Re-throw to be caught by React Query's error handling
      }
    },
    // Ensure that refetching won't reuse stale data when page changes
    keepPreviousData: false,
    // Disable refetching on window focus to prevent unexpected data changes
    refetchOnWindowFocus: false,
    ...options, // Spread options which are correctly typed
  });
};
