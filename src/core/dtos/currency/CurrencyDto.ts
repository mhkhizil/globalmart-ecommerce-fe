export interface CurrencyRequestDto {
  currency_code: string;
}

export interface Currency {
  id: number;
  currency_code: string;
  currency_name: string;
  symbol: string;
  rate: string;
  decimal_place: number;
  created_at: string;
  updated_at: string;
}

export interface GetCurrencyByCurrencyCodeResponseDto {
  data: Currency;
}

export interface GetAllCurrencyResponseDto {
  data: Currency[];
}
