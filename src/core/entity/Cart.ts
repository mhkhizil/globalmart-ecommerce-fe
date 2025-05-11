import { Product } from './Product';

export type Cart = {
  id?: string;
  cartItems: CartItems[];
};

export type CartItems = {
  id: string;
  product: Product;
  quantity: number;
  soldPrice: number;
};
