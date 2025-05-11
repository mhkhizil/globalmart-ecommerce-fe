import CartIcon from '@/components/common/icons/CartIcon';
import HomeIcon from '@/components/common/icons/HomeIcon';
import MessageIcon from '@/components/common/icons/MessageIcon';
import ProfileIcon from '@/components/common/icons/ProfileIcon';

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
    label: 'Cart',
    href: '/application/cart',
    isSelected: false,
    iconType: 'CartIcon',
  },
  {
    id: '3',
    label: 'Event',
    href: '/application/event-list',
    isSelected: false,
    iconType: 'EventIcon',
  },
  {
    id: '4',
    label: 'Profile',
    href: '/application/profile',
    isSelected: false,
    iconType: 'ProfileIcon',
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
