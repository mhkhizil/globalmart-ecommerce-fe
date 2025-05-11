import { ProductFilterByCategoryDto } from '@/core/dtos/product/ProductFilterByCategoryDto';
import { ProductFilterByMerchantDto } from '@/core/dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '@/core/dtos/product/ProductListResponseDto';
import { ProductResponseDto } from '@/core/dtos/product/ProductResponsedDto';

export interface IProductService {
  getProductListByCateogry(
    filter: ProductFilterByCategoryDto
  ): Promise<ProductListResponseDto>;
  getAllProduct(
    filter: ProductFilterByCategoryDto
  ): Promise<ProductListResponseDto>;
  getProductById(id: string): Promise<ProductResponseDto>;
  getProductListByMerchantId(
    filter: ProductFilterByMerchantDto
  ): Promise<ProductListResponseDto>;
  createProduct(requestDto: FormData): Promise<ProductResponseDto>;
}
