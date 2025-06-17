import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppliedCoupon, CartItem, CartState } from '@/lib/type/cart';

import { AppDispatch, RootState } from '../ReduxStore';

const initialState: CartState = {
  carts: {},
  currentUserId: undefined,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const userId = state.currentUserId || 'guest';
      if (!state.carts[userId]) {
        state.carts[userId] = {
          items: [],
          lastUpdated: Date.now(),
          version: 1,
        };
      }

      const currentCart = state.carts[userId];

      // Check if cart has items from a different merchant
      if (currentCart.items.length > 0) {
        const existingMerchantId = currentCart.items[0].merchant_id;
        if (existingMerchantId !== action.payload.merchant_id) {
          // Clear cart if trying to add item from different merchant
          currentCart.items = [];
          delete currentCart.appliedCoupon; // Also clear applied coupon for different merchant
        }
      }

      const existingItem = currentCart.items.find(
        item => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        currentCart.items.push(action.payload);
      }
      currentCart.lastUpdated = Date.now();

      // Validate and recalculate coupon discount
      validateAndRecalculateCoupon(currentCart);
    },
    addItemWithMerchantCheck: (
      state,
      action: PayloadAction<{ item: CartItem; replaceCart?: boolean }>
    ) => {
      const { item, replaceCart = true } = action.payload;
      const userId = state.currentUserId || 'guest';

      if (!state.carts[userId]) {
        state.carts[userId] = {
          items: [],
          lastUpdated: Date.now(),
          version: 1,
        };
      }

      const currentCart = state.carts[userId];

      // Check if cart has items from a different merchant
      if (currentCart.items.length > 0) {
        const existingMerchantId = currentCart.items[0].merchant_id;
        if (existingMerchantId === item.merchant_id) {
          // Same merchant, check if item already exists
          const existingItem = currentCart.items.find(
            existingItem => existingItem.id === item.id
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            currentCart.items.push(item);
          }
        } else {
          if (replaceCart) {
            // Clear cart and add new item
            currentCart.items = [item];
            delete currentCart.appliedCoupon; // Also clear applied coupon for different merchant
          } else {
            // Don't add item if merchant doesn't match and replaceCart is false
            return;
          }
        }
      } else {
        // Empty cart, just add the item
        currentCart.items.push(item);
      }

      currentCart.lastUpdated = Date.now();

      // Validate and recalculate coupon discount
      validateAndRecalculateCoupon(currentCart);
    },
    decreaseItemQuantity: (state, action: PayloadAction<number>) => {
      const userId = state.currentUserId || 'guest';
      if (state.carts[userId]) {
        const itemIndex = state.carts[userId].items.findIndex(
          item => item.id === action.payload
        );

        if (itemIndex !== -1) {
          const item = state.carts[userId].items[itemIndex];

          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            // Remove item completely if quantity would reach 0
            state.carts[userId].items.splice(itemIndex, 1);
          }

          state.carts[userId].lastUpdated = Date.now();

          // Validate and recalculate coupon discount
          validateAndRecalculateCoupon(state.carts[userId]);
        }
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const userId = state.currentUserId || 'guest';
      if (state.carts[userId]) {
        state.carts[userId].items = state.carts[userId].items.filter(
          item => item.id !== action.payload
        );
        state.carts[userId].lastUpdated = Date.now();

        // Validate and recalculate coupon discount
        validateAndRecalculateCoupon(state.carts[userId]);
      }
    },
    setUser: (state, action: PayloadAction<string | undefined>) => {
      state.currentUserId = action.payload;
    },
    clearCart: state => {
      const userId = state.currentUserId || 'guest';
      if (state.carts[userId]) {
        state.carts[userId].items = [];
        delete state.carts[userId].appliedCoupon;
        state.carts[userId].lastUpdated = Date.now();
      }
    },
    mergeCarts: (
      state,
      action: PayloadAction<{ sourceUserId: string; targetUserId: string }>
    ) => {
      const { sourceUserId, targetUserId } = action.payload;
      const sourceCart = state.carts[sourceUserId];
      if (!sourceCart) return;

      // Initialize target cart if it doesn't exist
      if (!state.carts[targetUserId]) {
        state.carts[targetUserId] = {
          items: [],
          lastUpdated: Date.now(),
          version: 1,
        };
      }
      const targetCart = state.carts[targetUserId];

      // Merge items and handle duplicates - but only if from same merchant
      if (sourceCart.items.length > 0) {
        const sourceMerchantId = sourceCart.items[0].merchant_id;

        if (targetCart.items.length === 0) {
          // Target cart is empty, add all source items
          sourceCart.items.forEach(sourceItem => {
            targetCart.items.push({ ...sourceItem });
          });
          // Copy over any applied coupon from source cart
          if (sourceCart.appliedCoupon) {
            targetCart.appliedCoupon = { ...sourceCart.appliedCoupon };
          }
        } else {
          const targetMerchantId = targetCart.items[0].merchant_id;

          if (sourceMerchantId === targetMerchantId) {
            // Same merchant, merge items
            sourceCart.items.forEach(sourceItem => {
              const existingItem = targetCart.items.find(
                item => item.id === sourceItem.id
              );
              if (existingItem) {
                existingItem.quantity += sourceItem.quantity;
              } else {
                targetCart.items.push({ ...sourceItem });
              }
            });
            // If target cart doesn't have a coupon but source does, copy it over
            if (!targetCart.appliedCoupon && sourceCart.appliedCoupon) {
              targetCart.appliedCoupon = { ...sourceCart.appliedCoupon };
            }
          } else {
            // Different merchants, replace target cart with source cart
            targetCart.items = sourceCart.items.map(item => ({ ...item }));
            // Clear any existing coupon since we're switching merchants
            delete targetCart.appliedCoupon;
            // If source cart has a coupon, copy it over
            if (sourceCart.appliedCoupon) {
              targetCart.appliedCoupon = { ...sourceCart.appliedCoupon };
            }
          }
        }
      }

      // Update timestamps and cleanup
      targetCart.lastUpdated = Date.now();
      delete state.carts[sourceUserId]; // Remove the guest cart after merging
    },
    applyCouponToCart: (state, action: PayloadAction<AppliedCoupon>) => {
      const userId = state.currentUserId || 'guest';
      if (!state.carts[userId]) {
        state.carts[userId] = {
          items: [],
          lastUpdated: Date.now(),
          version: 1,
        };
      }
      state.carts[userId].appliedCoupon = action.payload;
      state.carts[userId].lastUpdated = Date.now();
    },
    removeCouponFromCart: state => {
      const userId = state.currentUserId || 'guest';
      if (state.carts[userId]) {
        delete state.carts[userId].appliedCoupon;
        state.carts[userId].lastUpdated = Date.now();
      }
    },
  },
});

// Helper function to validate coupon and recalculate discount
const validateAndRecalculateCoupon = (
  cart: { items: CartItem[]; appliedCoupon?: AppliedCoupon },
  minOrderThreshold = 0
) => {
  if (!cart.appliedCoupon) return;

  // Calculate current cart total
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Check if cart still meets minimum order amount
  const minOrderAmount = Number(cart.appliedCoupon.min_order_amount);
  if (cartTotal < minOrderAmount) {
    // Remove coupon if cart no longer meets minimum requirements
    delete cart.appliedCoupon;
    return;
  }

  // If coupon is still valid, recalculate discount amount
  if (
    cart.appliedCoupon.discount_type === 'percentage' &&
    cart.appliedCoupon.discount_percent
  ) {
    cart.appliedCoupon.discount_amount =
      (cartTotal * cart.appliedCoupon.discount_percent) / 100;
  }
  // For fixed amount discounts, the amount stays the same
};

export const loginUser =
  (userId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const currentState = getState().cart;
    // If the current user is undefined or a guest, merge the guest cart into the logged-in user's cart
    if (
      currentState.currentUserId === undefined ||
      currentState.currentUserId === 'guest'
    ) {
      dispatch(mergeCarts({ sourceUserId: 'guest', targetUserId: userId }));
    }
    // Finally, update the current user id
    dispatch(setUser(userId));
  };

export const {
  addItem,
  addItemWithMerchantCheck,
  removeItem,
  setUser,
  decreaseItemQuantity,
  clearCart,
  mergeCarts,
  applyCouponToCart,
  removeCouponFromCart,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
