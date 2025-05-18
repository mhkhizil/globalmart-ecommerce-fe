import CartIcon from '@/components/common/icons/CartIcon';
import HomeIcon from '@/components/common/icons/HomeIcon';
import MessageIcon from '@/components/common/icons/MessageIcon';
import ProfileIcon from '@/components/common/icons/ProfileIcon';
import SearchIcon from '@/components/common/icons/SearchIcon';
import SettingIcon from '@/components/common/icons/SettingIcon';
import WishlistIcon from '@/components/common/icons/WishlistIcon';

import { NavigationBarMenuProps } from '../redux/slices/NavigationBarSlice';

export const NavigationMenu: NavigationBarMenuProps[] = [
  {
    id: '1',
    label: 'Home',
    href: '/application/home',
    isSelected: true,
    iconType: 'HomeIcon',
  },
  {
    id: '2',
    label: 'Wishlist',
    href: '#',
    isSelected: false,
    iconType: 'WishlistIcon',
  },
  {
    id: '3',
    label: 'Cart',
    href: '/application/cart',
    isSelected: false,
    iconType: 'CartIcon',
  },
  {
    id: '4',
    label: 'Search',
    href: '/application/search',
    isSelected: false,
    iconType: 'SearchIcon',
  },
  {
    id: '5',
    label: 'Setting',
    href: '/application/profile',
    isSelected: false,
    iconType: 'SettingIcon',
  },
];

export const NavigationMenuMerchant: NavigationBarMenuProps[] = [
  {
    id: '1',
    label: 'Home',
    href: '/application/merchant-home',
    isSelected: true,
    iconType: 'HomeIcon',
  },
  {
    id: '2',
    label: 'Payment',
    href: '/application/merchant-payment',
    isSelected: false,
    iconType: 'PaymentMenuIcon',
  },
  {
    id: '3',
    label: 'Shop',
    href: '/application/merchant-shop-list',
    isSelected: false,
    iconType: 'ShopIcon',
  },
  {
    id: '4',
    label: 'Profile',
    href: '/application/profile',
    isSelected: false,
    iconType: 'ProfileIcon',
  },
];

export const NavigationMenuDriver: NavigationBarMenuProps[] = [
  {
    id: '1',
    label: 'Home',
    href: '/application/driver-home',
    isSelected: true,
    iconType: 'HomeIcon',
  },
  {
    id: '2',
    label: 'Order List',
    href: '/application/driver-order-list',
    isSelected: false,
    iconType: 'ListIcon',
  },
  {
    id: '3',
    label: 'Profile',
    href: '/application/profile',
    isSelected: false,
    iconType: 'ProfileIcon',
  },
];
