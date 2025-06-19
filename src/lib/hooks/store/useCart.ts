import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/lib/redux/ReduxStore';
import {
  addItem,
  addItemWithMerchantCheck,
  applyCouponToCart,
  clearCart,
  decreaseItemQuantity,
  removeCouponFromCart,
  removeItem,
  setUser,
} from '@/lib/redux/slices/CartSlice';
import { AppliedCoupon, CartItem } from '@/lib/type/cart';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { carts, currentUserId } = useSelector(
    (state: RootState) => state.cart
  );
  const userId = currentUserId || 'guest';
  const cart = carts[userId] || { items: [], lastUpdated: 0, version: 1 };

  // Ensure all cart items have a name property (fallback for existing items without name)
  const itemsWithName = cart.items.map(item => ({
    ...item,
    name: item.name || `Product ${item.id}`, // Fallback name if missing
  }));

  return {
    userId: userId,
    items: itemsWithName,
    appliedCoupon: cart.appliedCoupon,
    lastUpdated: cart.lastUpdated,
    version: cart.version,
    totalItems: itemsWithName.reduce((total, item) => total + item.quantity, 0),
    totalPrice: itemsWithName.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
    addItem: (item: CartItem) => dispatch(addItem(item)),
    addItemWithMerchantCheck: (item: CartItem, replaceCart?: boolean) =>
      dispatch(addItemWithMerchantCheck({ item, replaceCart })),
    removeItem: (id: number) => dispatch(removeItem(id)),
    decreaseItemQuantity: (id: number) => dispatch(decreaseItemQuantity(id)),
    clearCart: () => dispatch(clearCart()),
    setUser: (userId: string | undefined) => dispatch(setUser(userId)),
    applyCoupon: (coupon: AppliedCoupon) => dispatch(applyCouponToCart(coupon)),
    removeCoupon: () => dispatch(removeCouponFromCart()),
  };
};
