'use client';

import { PersistGate } from 'redux-persist/integration/react';

import { persistor } from '@/lib/redux/ReduxStore';

function ReduxPersistProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistGate loading={undefined} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
export default ReduxPersistProvider;
