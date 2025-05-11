export type PromotionListResponseDto = {
  promotion: [
    {
      id: number;
      m_id: number;
      s_id: number;
      p_id: number;
      name: string;
      en_description: string;
      mm_description: string;
      th_description: string;
      cn_description: string;
      start_date: string;
      end_date: string;
      level: string;
      status: string;
      created_at: string;
      updated_at: string;
      type: 'promo' | 'ads' | 'text';
      image: string;
    },
  ];
};

export type PromotionListRequestDto = {
  type?: string;
};
