import { SVGProps } from 'react';

function CouponIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15c0-4.142-3.358-7.5-7.5-7.5S6 10.858 6 15c0 .161.006.321.018.479m15 0A3.007 3.007 0 0 1 18 18H6.5m14.5-3.717c-.358-.401-.771-.754-1.22-1.051M4.5 13.5C3.672 13.5 3 14.172 3 15v2.25c0 .414.336.75.75.75h2.25a.75.75 0 0 0 .75-.75V15a1.5 1.5 0 0 0-1.5-1.5z" />
    </svg>
  );
}

export default CouponIcon;
