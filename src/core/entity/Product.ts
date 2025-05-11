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
  m_id: number;
  m_name: string;
  shop_name: string | null; // Added missing field
  c_id: number;
  c_name: string;
  p_id: number;
  p_name: string;
  discount_type: 'percentage' | 'fixed';
  discount_percent: number;
  discount_amount: string;
  en_description: string; // Maps to en_description
  mm_description: string | null; // Added for Myanmar
  th_description: string | null; // Added for Thai
  cn_description: string | null; // Added for Chinese
  p_price: number;
  p_stock: number;
  p_is_available: number;
  p_sortBy: number;
  p_image: string;
  product_image: Array<{
    id: number;
    p_id: number;
    link: string;
    type: number;
    created_at: string;
    updated_at: string;
  }>; // Fixed array syntax
};
export type Product = {
  id: number;
  c_id: number;
  m_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  is_available: number;
  sortBy: number;
  image: string;
  created_at: string;
  updated_at: string;
};
