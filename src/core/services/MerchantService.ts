import {
  CreateDiscountRequestDto,
  CreateDiscountResponseDto,
} from '../dtos/discount/DiscountDto';
import {
  CreateDriverDto,
  DriverDto,
  DriverListResponseDto,
  GetDriverListByMerchantIdRequestDto,
} from '../dtos/merchant/DriverDto';
import { MerchantRegisterRequestDto } from '../dtos/merchant/MerchantRegisterRequestDto';
import { MerchantRegisterResponseDto } from '../dtos/merchant/MerchantRegisterResponseDto';
import {
  MerchantWithdrawData,
  MerchantWithdrawRequestDto,
} from '../dtos/merchant/MerchantWithdrawDto';
import {
  WeeklyChartDataRequestDto,
  WeeklyChartDataResponseDto,
} from '../dtos/merchant/WeeklyChartDataResponseDto';
import { IMerchantRepository } from '../interface/repository/IMerchantRepository';
import { IMerchantService } from '../interface/service/IMerchantService';

export class MerchantService implements IMerchantService {
  constructor(private readonly repository: IMerchantRepository) {}

  async register(
    loginDto: MerchantRegisterRequestDto
  ): Promise<MerchantRegisterResponseDto> {
    return await this.repository.register<
      MerchantRegisterRequestDto,
      MerchantRegisterResponseDto
    >(loginDto);
  }

  async registerDriver(registerDto: FormData): Promise<DriverDto> {
    try {
      console.log(
        'MerchantService.registerDriver - Starting driver registration service'
      );

      // Validate that key fields exist in the FormData
      const requiredFields = [
        'name',
        'email',
        'password',
        'confirm_password',
        'contact_number',
      ];
      const missingFields = requiredFields.filter(
        field => !registerDto.get(field)
      );

      if (missingFields.length > 0) {
        console.error(
          'Missing required fields in FormData:',
          missingFields.join(', ')
        );
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Check for image file
      if (!registerDto.get('image')) {
        console.warn('No image file in FormData');
      }

      // Pass the FormData directly to the repository
      const response = await this.repository.registerDriver<
        FormData,
        DriverDto
      >(registerDto);

      //console.log('Driver registration service completed successfully');
      return response;
    } catch (error) {
      console.error('Error in registerDriver service:', error);
      throw error;
    }
  }

  async getDriverListByMerchantId(
    requestDto: GetDriverListByMerchantIdRequestDto
  ): Promise<DriverListResponseDto> {
    return await this.repository.getDriverListByMerchantId<
      GetDriverListByMerchantIdRequestDto,
      DriverListResponseDto
    >(requestDto);
  }

  async assignDriverToOrder(requestDto: FormData): Promise<DriverDto> {
    return await this.repository.assignDriverToOrder<FormData, DriverDto>(
      requestDto
    );
  }

  async getWeeklyChartData(
    requestDto: WeeklyChartDataRequestDto
  ): Promise<WeeklyChartDataResponseDto> {
    return await this.repository.getWeeklyChartData<
      WeeklyChartDataRequestDto,
      WeeklyChartDataResponseDto
    >(requestDto);
  }

  async createDiscount(
    requestDto: CreateDiscountRequestDto
  ): Promise<CreateDiscountResponseDto> {
    return await this.repository.createDiscount<
      CreateDiscountRequestDto,
      CreateDiscountResponseDto
    >(requestDto);
  }

  async getMerchantWithdrawList(
    requestDto: MerchantWithdrawRequestDto
  ): Promise<MerchantWithdrawData[]> {
    return await this.repository.getMerchantWithdrawList<
      MerchantWithdrawRequestDto,
      MerchantWithdrawData[]
    >(requestDto);
  }
}
