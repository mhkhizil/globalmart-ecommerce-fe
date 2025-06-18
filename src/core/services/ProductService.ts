import { ProductFilterByCategoryDto } from '../dtos/product/ProductFilterByCategoryDto';
import { ProductFilterByMerchantDto } from '../dtos/product/ProductFilterByMerchantDto';
import { ProductListResponseDto } from '../dtos/product/ProductListResponseDto';
import { ProductResponseDto } from '../dtos/product/ProductResponsedDto';
import { ProductDetailByMerchantRequestDto } from '../dtos/product/ProductDetailByMerchantRequestDto';
import { ProductDetailByMerchantResponseDto } from '../dtos/product/ProductDetailByMerchantResponseDto';
import { Product } from '../entity/Product';
import { IProductRepository } from '../interface/repository/IProductRepository';
import { IProductService } from '../interface/service/IProductService';

export class ProductService implements IProductService {
  constructor(private readonly ProductRepository: IProductRepository) {}
  async getProductListByCateogry(
    filter: ProductFilterByCategoryDto
  ): Promise<ProductListResponseDto> {
    const response = await this.ProductRepository.getProductListByCategory<
      ProductFilterByCategoryDto,
      ProductListResponseDto
    >(filter);
    return response;
  }
  async getAllProduct(
    filter: ProductFilterByCategoryDto
  ): Promise<ProductListResponseDto> {
    const response = await this.ProductRepository.getAllProduct<
      ProductFilterByCategoryDto,
      ProductListResponseDto
    >(filter);
    return response;
  }
  async getProductListByMerchantId(
    filter: ProductFilterByMerchantDto
  ): Promise<ProductListResponseDto> {
    const response = await this.ProductRepository.getProductListByMerchantId<
      ProductFilterByMerchantDto,
      ProductListResponseDto
    >(filter);
    return response;
  }
  async getProductById(id: string): Promise<ProductResponseDto> {
    const response =
      await this.ProductRepository.getProductById<ProductResponseDto>(id);
    return response;
  }
  async createProduct(requestDto: FormData): Promise<ProductResponseDto> {
    const response = await this.ProductRepository.createProduct<
      FormData,
      ProductResponseDto
    >(requestDto);
    return response;
  }
  async getTrendingProductList(
    filter: ProductFilterByCategoryDto
  ): Promise<ProductListResponseDto> {
    const response = await this.ProductRepository.getTrendingProductList<
      ProductFilterByCategoryDto,
      ProductListResponseDto
    >(filter);
    return response;
  }
  async getProductDetailByMerchant(
    filter: ProductDetailByMerchantRequestDto
  ): Promise<ProductDetailByMerchantResponseDto> {
    const response = await this.ProductRepository.getProductDetailByMerchant<
      ProductDetailByMerchantRequestDto,
      ProductDetailByMerchantResponseDto
    >(filter);
    return response;
  }
}
