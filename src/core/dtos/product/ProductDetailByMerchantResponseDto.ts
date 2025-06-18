export type ProductDetailByMerchantImage = {
  id: number;
  product_detail_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
};

export type ProductDetailByMerchantItem = {
  id: number;
  product_id: number;
  sku: string;
  price: string;
  stock: number;
  color_id: number;
  color_code: string;
  color_name: string;
  size: string;
  status: number;
  is_available: number;
  sortBy: number;
  link: string | null;
  created_at: string;
  updated_at: string;
  product_detail_id: number;
  merchant_id: number;
  merchant_name: string;
  shop_name: string;
  category_id: number;
  category_name: string;
  subcategory_id: number;
  subcategory_name: string;
  product_name: string;
  en_description: string | null;
  mm_description: string | null;
  th_description: string | null;
  cn_description: string | null;
  discount_type: string | null;
  discount_percent: number | null;
  discount_amount: string | null;
  discount_price: string | null;
  product_detail_image: ProductDetailByMerchantImage[];
};

export type ProductDetailByMerchantData = {
  product_details: ProductDetailByMerchantItem[];
};

export type ProductDetailByMerchantResponseDto = {
  status: string;
  message: string;
  count: number;
  current_page: number;
  last_page: number;
  per_page: number;
  data: ProductDetailByMerchantData;
};
