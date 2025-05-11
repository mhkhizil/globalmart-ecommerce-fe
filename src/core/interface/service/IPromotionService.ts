import {
  PromotionListRequestDto,
  PromotionListResponseDto,
} from '@/core/dtos/promotion/PromotionListResponseDto';

export interface IPromotionService {
  getPromotionList(
    requestDto: PromotionListRequestDto
  ): Promise<PromotionListResponseDto>;
}
