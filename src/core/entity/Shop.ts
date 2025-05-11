export type Shop = {
  id: number;
  name: string;
  link: string;
  shop_type_id: number;
  merchant_id: number;
  image: string;
  cover_image: string;
  status: string;
  phone: string;
  addr: string;
  description: string;
  en_addr: string;
  mm_addr: string;
  th_addr: string;
  cn_addr: string;
  en_description: string;
  mm_description: string;
  th_description: string;
  cn_description: string;
  opening_time: string;
  closing_time: string;
  created_at: string;
  updated_at: string;
};

export type ShopType = {
  id: number;
  name: string;
  img_url: string;
  status: string;
  created_at: string;
  updated_at: string;
};
