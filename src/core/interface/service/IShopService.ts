import { GetMerchantShopListRequestDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListRequestDto';
import { GetMerchantShopListResponseDto } from '@/core/dtos/shop/get-merchant-shoplist/GetMerchantShopListResponseDto';
import { GetShopDetailRequestDto } from '@/core/dtos/shop/get-shop-detail/GetShopDetailReqeustDto';
import { GetShopDetailResponseDto } from '@/core/dtos/shop/get-shop-detail/GetShopDetailResponseDto';
import { RegisterShopRequestDto } from '@/core/dtos/shop/shop-register/RegisterShopRequestDto';
import { RegisterShopResponseDto } from '@/core/dtos/shop/shop-register/RegisterShopResponseDto';
import { ShopListResponseDto } from '@/core/dtos/shop/ShopResponseDto';

export interface IShopService {
  registerShop(reqeustData: FormData): Promise<RegisterShopResponseDto>;
  getMerchantShopList(
    filter: GetMerchantShopListRequestDto
  ): Promise<GetMerchantShopListResponseDto>;
  getShopDetail(
    filter: GetShopDetailRequestDto
  ): Promise<GetShopDetailResponseDto>;
}
