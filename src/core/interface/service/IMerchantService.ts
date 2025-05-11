import {
  CreateDiscountRequestDto,
  CreateDiscountResponseDto,
} from '@/core/dtos/discount/DiscountDto';
import {
  DriverDto,
  DriverListResponseDto,
  GetDriverListByMerchantIdRequestDto,
} from '@/core/dtos/merchant/DriverDto';
import { MerchantRegisterRequestDto } from '@/core/dtos/merchant/MerchantRegisterRequestDto';
import { MerchantRegisterResponseDto } from '@/core/dtos/merchant/MerchantRegisterResponseDto';
import {
  MerchantWithdrawData,
  MerchantWithdrawRequestDto,
} from '@/core/dtos/merchant/MerchantWithdrawDto';
import {
  WeeklyChartDataRequestDto,
  WeeklyChartDataResponseDto,
} from '@/core/dtos/merchant/WeeklyChartDataResponseDto';

export interface IMerchantService {
  register(
    loginDto: MerchantRegisterRequestDto
  ): Promise<MerchantRegisterResponseDto>;
  registerDriver(registerDto: FormData): Promise<DriverDto>;
  getDriverListByMerchantId(
    requestDto: GetDriverListByMerchantIdRequestDto
  ): Promise<DriverListResponseDto>;
  assignDriverToOrder(requestDto: FormData): Promise<DriverDto>;
  getWeeklyChartData(
    requestDto: WeeklyChartDataRequestDto
  ): Promise<WeeklyChartDataResponseDto>;
  createDiscount(
    requestDto: CreateDiscountRequestDto
  ): Promise<CreateDiscountResponseDto>;
  getMerchantWithdrawList(
    requestDto: MerchantWithdrawRequestDto
  ): Promise<MerchantWithdrawData[]>;
}
