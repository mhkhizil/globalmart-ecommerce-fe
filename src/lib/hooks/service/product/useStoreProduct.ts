import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { ProductRepository } from '@/core/repository/ProductRepository';
import { ProductService } from '@/core/services/ProductService';
import { AxiosCustomClient } from '@/lib/axios/AxiosClient';

type StoreProductOption = Omit<
  UseMutationOptions<any, Error, FormData>,
  'mutationFn'
>;

export const useStoreProduct = (option: StoreProductOption) => {
  return useMutation<any, Error, FormData>({
    mutationKey: ['store-product'],
    mutationFn: async StoreProductData => {
      const service = new ProductService(
        new ProductRepository(new AxiosCustomClient())
      );
      return await service.createProduct(StoreProductData);
    },
    ...option,
  });
};
