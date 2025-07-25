import { useDispatch, useSelector } from 'react-redux';

import { ShippingAddressData } from '@/components/module/shipping/ShippingAddress';
import { AppDispatch, RootState } from '@/lib/redux/ReduxStore';
import {
  clearAddress,
  clearDeliveryLocation,
  DeliveryLocation,
  saveShippingAddress,
  selectAddress,
  setDeliveryLocation,
} from '@/lib/redux/slices/ShippingAddressSlice';

export const useShippingAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, selectedAddressId, currentUserId, deliveryLocation } =
    useSelector((state: RootState) => state.shippingAddress);

  // Get user's saved addresses
  const userAddresses = currentUserId ? addresses[currentUserId] || [] : [];

  // Get current selected address
  const currentAddress = selectedAddressId
    ? userAddresses.find(addr => addr.id === selectedAddressId)
    : userAddresses.find(addr => addr.isDefault) || userAddresses[0];

  return {
    // Get all addresses for current user
    getAddresses: () => userAddresses,

    // Get currently selected address
    currentAddress,

    // Get current delivery location
    deliveryLocation,

    // Save a new address
    saveAddress: (address: ShippingAddressData) => {
      dispatch(
        saveShippingAddress({
          address: {
            ...address,
            id: selectedAddressId || `addr_${Date.now()}`, // Generate ID if new
          },
        })
      );
    },

    // Select a specific address by ID
    selectAddress: (addressId: string) => {
      dispatch(selectAddress(addressId));
    },

    // Clear all addresses
    clearAddresses: () => {
      dispatch(clearAddress());
    },

    // Set delivery location (current location)
    setDeliveryLocation: (location: DeliveryLocation | null) => {
      dispatch(setDeliveryLocation(location));
    },

    // Clear delivery location
    clearDeliveryLocation: () => {
      dispatch(clearDeliveryLocation());
    },
  };
};
