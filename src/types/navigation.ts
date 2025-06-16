export interface NavigationMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

export const NAVIGATION_ROUTES = {
  HOME: '/application/home',
  TRENDING: '/application/trending-product',
  DEAL_OF_THE_DAY: '/application/deal-of-the-day',
  NEW_ARRIVAL: '/application/new-arrival',
} as const;

export type NavigationRoute =
  (typeof NAVIGATION_ROUTES)[keyof typeof NAVIGATION_ROUTES];
