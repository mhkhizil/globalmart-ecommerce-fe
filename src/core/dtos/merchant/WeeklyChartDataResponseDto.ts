export interface WeeklyChartDataResponseDto {
  status: 'success';
  data: {
    summary: {
      totalRevenue: number;
      currency: string;
      period: string;
    };
  };
  dailyData: Array<{
    date: string;
    timestamp: string;
    revenue: number;
    orderCount: number;
  }>;
}

export interface WeeklyChartDataRequestDto {
  merchant_id: number;
}
