import { HTMLAttributes } from 'react';

interface InputProps extends HTMLAttributes<HTMLDivElement> {}

function LocationIcon(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <>
      <svg
        width="16"
        height="19"
        viewBox="0 0 18 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M14.6569 14.6569C13.7202 15.5935 11.7616 17.5521 10.4138 18.8999C9.63275 19.681 8.36768 19.6814 7.58663 18.9003C6.26234 17.576 4.34159 15.6553 3.34315 14.6569C0.218951 11.5327 0.218951 6.46734 3.34315 3.34315C6.46734 0.218951 11.5327 0.218951 14.6569 3.34315C17.781 6.46734 17.781 11.5327 14.6569 14.6569Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

export default LocationIcon;
