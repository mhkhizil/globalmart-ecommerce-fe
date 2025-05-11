'use client';

import { useSession } from '@/lib/hooks/session/useSession';

import DriverRunningOrderList from './DriverRunningOrderList';

function DriverOrderList() {
  const { data: sessionData } = useSession();
  const driverId = sessionData?.user?.driver_id;
  return (
    <div className="flex-1 relative  bg-gray-50 font-sans">
      <h1 className="text-2xl  font-bold text-center">Order List</h1>
      <DriverRunningOrderList
        driverId={driverId}
        perPage={2}
        showFilter={false}
      />
    </div>
  );
}
export default DriverOrderList;
