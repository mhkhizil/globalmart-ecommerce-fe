import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CartItem, CartState } from '@/lib/type/cart';

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
      const existingItem = state.carts[userId].items.find(
        item => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.carts[userId].items.push(action.payload);
      }
      state.carts[userId].lastUpdated = Date.now();
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
      }
    },
    setUser: (state, action: PayloadAction<string | undefined>) => {
      state.currentUserId = action.payload;
    },
    clearCart: state => {
      const userId = state.currentUserId || 'guest';
      if (state.carts[userId]) {
        state.carts[userId].items = [];
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

      // Merge items and handle duplicates
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

      // Update timestamps and cleanup
      targetCart.lastUpdated = Date.now();
      delete state.carts[sourceUserId]; // Remove the guest cart after merging
    },
  },
});

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
  removeItem,
  setUser,
  decreaseItemQuantity,
  clearCart,
  mergeCarts,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
