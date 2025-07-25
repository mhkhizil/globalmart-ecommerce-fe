import { memo } from 'react';

const MessageIcon = memo(({ isSelected = false }: { isSelected?: boolean }) => {
  return (
    <>
      <svg
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
      </svg>
    </>
  );
});
MessageIcon.displayName = 'MessageIcon';
export default MessageIcon;
