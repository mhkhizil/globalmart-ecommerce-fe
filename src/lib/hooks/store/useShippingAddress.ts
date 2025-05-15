import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/lib/redux/ReduxStore';
import {
  clearAddress,
  saveShippingAddress,
  selectAddress,
} from '@/lib/redux/slices/ShippingAddressSlice';
import { ShippingAddressData } from '@/components/module/shipping/ShippingAddress';

export const useShippingAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, selectedAddressId, currentUserId } = useSelector(
    (state: RootState) => state.shippingAddress
  );

  // Get user's saved addresses
  const userAddresses = currentUserId
    ? addresses[currentUserId] || []
    : [];

  // Get current selected address
  const currentAddress = selectedAddressId
    ? userAddresses.find(addr => addr.id === selectedAddressId)
    : userAddresses.find(addr => addr.isDefault) || userAddresses[0];

  return {
    // Get all addresses for current user
    getAddresses: () => userAddresses,
    
    // Get currently selected address
    currentAddress,
    
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
  };
}; 