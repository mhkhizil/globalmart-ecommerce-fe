import { GetMerchantShopListRequestDto } from '../dtos/shop/get-merchant-shoplist/GetMerchantShopListRequestDto';
import { GetMerchantShopListResponseDto } from '../dtos/shop/get-merchant-shoplist/GetMerchantShopListResponseDto';
import { GetShopDetailRequestDto } from '../dtos/shop/get-shop-detail/GetShopDetailReqeustDto';
import { GetShopDetailResponseDto } from '../dtos/shop/get-shop-detail/GetShopDetailResponseDto';
import { RegisterShopRequestDto } from '../dtos/shop/shop-register/RegisterShopRequestDto';
import { RegisterShopResponseDto } from '../dtos/shop/shop-register/RegisterShopResponseDto';
import { ShopListResponseDto } from '../dtos/shop/ShopResponseDto';
import { IShopRepository } from '../interface/repository/IShopRepository';
import { IShopService } from '../interface/service/IShopService';

export class ShopService implements IShopService {
  constructor(private readonly ShopRepository: IShopRepository) {}
  async getShopDetail(filter: string): Promise<GetShopDetailResponseDto> {
    const response =
      await this.ShopRepository.getShopDetail<GetShopDetailResponseDto>(filter);

    return response;
  }
  async getMerchantShopList(
    filter: GetMerchantShopListRequestDto
  ): Promise<GetMerchantShopListResponseDto> {
    const response = await this.ShopRepository.getMerchantShopList<
      GetMerchantShopListRequestDto,
      GetMerchantShopListResponseDto
    >(filter);

    return response;
  }
  async registerShop(data: FormData): Promise<RegisterShopResponseDto> {
    const response = await this.ShopRepository.registerShop<
      FormData,
      RegisterShopResponseDto
    >(data);

    return response;
  }
}
