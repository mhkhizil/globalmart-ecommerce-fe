import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/lib/redux/ReduxStore';
import {
  addItem,
  clearCart,
  decreaseItemQuantity,
  removeItem,
  setUser,
} from '@/lib/redux/slices/CartSlice';
import { CartItem } from '@/lib/type/cart';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { carts, currentUserId } = useSelector(
    (state: RootState) => state.cart
  );
  const userId = currentUserId || 'guest';
  const cart = carts[userId] || { items: [], lastUpdated: 0, version: 1 };

  return {
    userId: userId,
    items: cart.items,
    lastUpdated: cart.lastUpdated,
    version: cart.version,
    totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),

    addToCart: (item: CartItem) => dispatch(addItem({ ...item })),

    decreaseQuantity: (itemId: number) =>
      dispatch(decreaseItemQuantity(itemId)),

    removeFromCart: (itemId: number) => dispatch(removeItem(itemId)),

    setUser: (userId: string | undefined) => dispatch(setUser(userId)),

    clearCart: () => dispatch(clearCart()),
  };
};
