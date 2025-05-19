import { motion } from 'framer-motion';
import { ArrowUpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useGetCustomerWallet } from '@/lib/hooks/service/payment/useGetCustomerWallet';
import { SessionData } from '@/lib/iron-session/session-option';

interface IInputProps {
  sessionData:
    | {
        user?: {
          id: number;
          roles: number;
          merchant_id: number;
        };
      }
    | undefined;
}

function BalanceDisplay({ sessionData }: IInputProps) {
  const t = useTranslations('wallet');
  const { data: walletData, isLoading } = useGetCustomerWallet(
    sessionData?.user?.id.toString() || '',
    {
      enabled: !!sessionData?.user?.id,
    }
  );

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-sm p-4 mb-4 border-[#EDEDED] border-[1px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#101010] text-[0.875rem] font-medium">
          {t('yourBalance')}
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#FE8C00]" />
              <span className="text-gray-500 text-sm">
                {t('loadingBalance')}
              </span>
            </div>
          ) : (
            <motion.div
              className="flex flex-col"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <span className="text-[1.5rem] font-bold text-[#101010]">
                ${Number(walletData?.wallet_amount).toFixed(2) || '0.00'}
              </span>
              <span className="text-gray-500 text-xs">
                {t('availableBalance')}
              </span>
            </motion.div>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/application/customer-wallet-refill"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FE8C00] text-white font-medium text-sm rounded-full transition-colors hover:bg-[#e07e00]"
          >
            <ArrowUpCircle className="h-4 w-4" />
            {t('refill')}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default BalanceDisplay;
