import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ShippingAddressData } from '@/components/module/shipping/ShippingAddress';

// Extended ShippingAddressData with ID
export interface ShippingAddress extends ShippingAddressData {
  id: string;
}

// Delivery location type
export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address: string;
  placeName?: string; // Optional place name for better display
}

// State definition
export interface ShippingAddressState {
  addresses: {
    [userId: string]: ShippingAddress[];
  };
  selectedAddressId: string | null;
  currentUserId: string | undefined;
  deliveryLocation: DeliveryLocation | null; // Current location for delivery
}

// Initial state
const initialState: ShippingAddressState = {
  addresses: {},
  selectedAddressId: '',
  currentUserId: undefined,
  deliveryLocation: null,
};

// Create slice
const shippingAddressSlice = createSlice({
  name: 'shippingAddress',
  initialState,
  reducers: {
    // Save or update shipping address
    saveShippingAddress: (
      state,
      action: PayloadAction<{ address: ShippingAddress }>
    ) => {
      const userId = state.currentUserId || 'guest';
      const { address } = action.payload;

      // Initialize user addresses if not present
      if (!state.addresses[userId]) {
        state.addresses[userId] = [];
      }

      // Check if address already exists
      const existingAddressIndex = state.addresses[userId].findIndex(
        addr => addr.id === address.id
      );

      if (existingAddressIndex === -1) {
        // Add new address
        state.addresses[userId].push(address);
      } else {
        // Update existing address
        state.addresses[userId][existingAddressIndex] = address;
      }

      // If this is the default address, make all others non-default
      if (address.isDefault) {
        state.addresses[userId].forEach(addr => {
          if (addr.id !== address.id) {
            addr.isDefault = false;
          }
        });
      }

      // Select this address
      state.selectedAddressId = address.id;
    },

    // Select address by ID
    selectAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
    },

    // Remove address by ID
    removeAddress: (state, action: PayloadAction<string>) => {
      const userId = state.currentUserId || 'guest';

      if (state.addresses[userId]) {
        state.addresses[userId] = state.addresses[userId].filter(
          addr => addr.id !== action.payload
        );

        // If we removed the selected address, select the default or first one
        if (state.selectedAddressId === action.payload) {
          const defaultAddress = state.addresses[userId].find(
            addr => addr.isDefault
          );
          state.selectedAddressId = defaultAddress
            ? defaultAddress.id
            : state.addresses[userId][0]?.id || '';
        }
      }
    },

    // Set current user ID
    setUser: (state, action: PayloadAction<string | undefined>) => {
      state.currentUserId = action.payload;

      // Reset selected address when user changes
      if (state.currentUserId) {
        const userAddresses = state.addresses[state.currentUserId] || [];
        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        state.selectedAddressId = defaultAddress
          ? defaultAddress.id
          : userAddresses[0]?.id || '';
      } else {
        state.selectedAddressId = '';
      }
    },

    // Clear all addresses
    clearAddress: state => {
      const userId = state.currentUserId || 'guest';
      if (state.addresses[userId]) {
        state.addresses[userId] = [];
        state.selectedAddressId = '';
      }
    },

    // Set delivery location (current location)
    setDeliveryLocation: (
      state,
      action: PayloadAction<DeliveryLocation | null>
    ) => {
      state.deliveryLocation = action.payload;
    },

    // Clear delivery location
    clearDeliveryLocation: state => {
      state.deliveryLocation = null;
    },
  },
});

// Export actions
export const {
  saveShippingAddress,
  selectAddress,
  removeAddress,
  setUser,
  clearAddress,
  setDeliveryLocation,
  clearDeliveryLocation,
} = shippingAddressSlice.actions;

// Export reducer
export default shippingAddressSlice.reducer;
