import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import HomeIcon from '@/components/common/icons/HomeIcon';
import { NavigationMenu } from '@/lib/constants/NavigationMenu';

import { RootState } from '../ReduxStore';

export interface NavigationBarMenuProps {
  id: string;
  label: string;
  href: string;
  isSelected: boolean;
  iconType: string;
}

const initialState: NavigationBarMenuProps[] = NavigationMenu;

export const navigationBarSlice = createSlice({
  name: 'navigationBar',
  initialState,
  reducers: {
    setIsSelected: (state, action: PayloadAction<string>) => {
      return (state = state.map(currentState => {
        return currentState.id == action.payload
          ? {
              ...currentState,
              isSelected: true,
            }
          : {
              ...currentState,
              isSelected: false,
            };
      }));
    },
    setNavigationMenu: (
      state,
      action: PayloadAction<NavigationBarMenuProps[]>
    ) => {
      return action.payload;
    },
    resetNavigation: () => initialState,
  },
});

export const { setIsSelected, setNavigationMenu, resetNavigation } =
  navigationBarSlice.actions;

export const selectNavigationBarMenu = (state: RootState) =>
  state.navigationBar as NavigationBarMenuProps[];

export const navigationBarReducer = navigationBarSlice.reducer;
