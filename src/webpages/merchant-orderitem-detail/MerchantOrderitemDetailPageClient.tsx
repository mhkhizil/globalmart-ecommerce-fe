'use client';

import { useTranslations } from 'next-intl';

import MerchantOrderItemDetail from '@/components/module/merchant-orderitem-detail/MerchantOrderItemDetail';
import { OrderItem } from '@/core/entity/Order';
import { withMerchantAuth } from '@/lib/hoc/with-merchant-auth';

interface IOrderItemProps {
  id: string;
}

function MerchantOrderItemDetailPageClient(props: IOrderItemProps) {
  const merchantT = useTranslations('merchant');
  const detailT = useTranslations('merchant_orderitem_detail');

  return (
    <MerchantOrderItemDetail
      {...props}
      translations={merchantT}
      detailTranslations={detailT}
    />
  );
}
export default withMerchantAuth(MerchantOrderItemDetailPageClient);
