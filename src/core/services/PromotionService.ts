import {
  PromotionListRequestDto,
  PromotionListResponseDto,
} from '../dtos/promotion/PromotionListResponseDto';
import { IPromotionRepository } from '../interface/repository/IPromotionRepository';
import { IPromotionService } from '../interface/service/IPromotionService';

export class PromotionService implements IPromotionService {
  constructor(private readonly CommonRepository: IPromotionRepository) {}
  async getPromotionList(
    requestDto: PromotionListRequestDto
  ): Promise<PromotionListResponseDto> {
    const response = await this.CommonRepository.getPromotionList<
      PromotionListRequestDto,
      PromotionListResponseDto
    >(requestDto);

    return response;
  }
}
