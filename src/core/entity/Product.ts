// export type ProductDetail = {
//   id: number;
//   m_id: number;
//   m_name: string;
//   c_id: number;
//   c_name: string;
//   p_id: number;
//   p_name: string;
//   p_description: string;
//   p_price: number;
//   p_stock: number;
//   p_is_available: number;
//   p_sortBy: number;
//   p_image: string;
//   product_image: [
//     {
//       id: number;
//       p_id: number;
//       link: string;
//       type: number;
//       created_at: string;
//       updated_at: string;
//     },
//   ];
// };

export type ProductDetail = {
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
  product_name: string;
  en_description: string;
  mm_description: string | null;
  th_description: string | null;
  cn_description: string | null;
  p_image: string;
  discount_type: 'percentage' | 'fixed' | null;
  discount_percent: string | null;
  discount_amount: string | null;
  discount_price: string | null;
  product_detail_image: Array<{
    id: number;
    product_detail_id: number;
    image_path: string;
    created_at: string;
    updated_at: string;
  }>;
};
export type Product = {
  id: number;
  merchant_id: number;
  merchant_name: string;
  shop_name: string;
  category_id: number;
  category_name: string;
  subcategory_id: number;
  subcategory_name: string;
  product_name: string;
  remark: string;
  en_description: string;
  mm_description: string | null;
  th_description: string | null;
  cn_description: string | null;
  p_is_available: number;
  p_sortBy: number;
  p_image: string;
  first_product_detail: ProductDetail;
};
