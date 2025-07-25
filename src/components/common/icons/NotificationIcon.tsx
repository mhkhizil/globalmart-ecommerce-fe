import { HtmlHTMLAttributes } from 'react';

interface InputProps extends HtmlHTMLAttributes<HTMLOrSVGElement> {}

function NotificationIcon(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
      >
        <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" />
        <path
          d="M23 25H28L26.5951 23.5951C26.2141 23.2141 26 22.6973 26 22.1585V19C26 16.3876 24.3304 14.1651 22 13.3414V13C22 11.8954 21.1046 11 20 11C18.8954 11 18 11.8954 18 13V13.3414C15.6696 14.1651 14 16.3876 14 19V22.1585C14 22.6973 13.7859 23.2141 13.4049 23.5951L12 25H17M23 25V26C23 27.6569 21.6569 29 20 29C18.3431 29 17 27.6569 17 26V25M23 25H17"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
export default NotificationIcon;
