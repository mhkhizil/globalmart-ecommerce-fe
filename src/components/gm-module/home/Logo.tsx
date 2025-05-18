import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/assets/logo-gradient-blue.svg"
          alt="Global Marts Logo"
          fill
          className="object-contain pointer-events-none"
          priority
        />
      </div>
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/assets/logo-blue.svg"
          alt="Global Marts Logo"
          fill
          className="object-contain pointer-events-none"
          priority
        />
      </div>
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/assets/logo-gradient-red.svg"
          alt="Global Marts Logo"
          fill
          className="object-contain pointer-events-none"
          priority
        />
      </div>
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/assets/logo-red.svg"
          alt="Global Marts Logo"
          fill
          className="object-contain pointer-events-none"
          priority
        />
      </div>
    </div>
  );
}
