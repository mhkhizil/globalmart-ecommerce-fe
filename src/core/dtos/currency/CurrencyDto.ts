export interface CurrencyRequestDto {
  currency_code: string;
}

export interface GetCurrencyByCurrencyCodeResponseDto {
  exchange_rate: Currency;
}

export interface GetAllCurrencyResponseDto {
  exchange_rate: Currency[];
}
