import { memo } from 'react';

const EventIcon = memo(({ isSelected = false }: { isSelected?: boolean }) => {
  return (
    <>
      {/* <svg
        width="21"
        height="18"
        viewBox="0 0 21 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.1001 9.0001C20.1001 13.6393 15.802 17.4001 10.5001 17.4001C8.71012 17.4001 7.03458 16.9714 5.60021 16.2251L0.900085 17.4001L2.50605 13.6528C1.49145 12.3209 0.900085 10.7209 0.900085 9.0001C0.900085 4.36091 5.19815 0.600098 10.5001 0.600098C15.802 0.600098 20.1001 4.36091 20.1001 9.0001ZM6.90009 7.8001H4.50009V10.2001H6.90009V7.8001ZM16.5001 7.8001H14.1001V10.2001H16.5001V7.8001ZM9.30009 7.8001H11.7001V10.2001H9.30009V7.8001Z"
          fill={isSelected ? '#FE8C00' : '#C2C2C2'}
        />
      </svg> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="gray"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          fill={isSelected ? '#FE8C00' : '#C2C2C2'}
        />
      </svg>
    </>
  );
});
EventIcon.displayName = 'EventIcon';
export default EventIcon;
