export interface Product {
  id: string;
  name: string;
  description: string;
  discountedPrice: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category?: string;
}
