import Image from 'next/image';
import Link from 'next/link';

export interface PromotionCardProps {
  id?: number;
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  link?: string;
}

const PromotionCard = ({
  id,
  title = '50-40% OFF',
  subtitle = 'Now in (product)',
  text = 'All colours',
  image = '/images/promotion/placeholder.jpg',
  link = '#',
}: PromotionCardProps) => {
  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-[12px]">
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: '#FFA3B3' }}
      >
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
        <div className="flex flex-col gap-1">
          <h3
            className="font-montserrat text-[20px] font-bold leading-[1.1em] text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {title}
          </h3>
          <p
            className="font-montserrat text-[12px] font-normal leading-[1.33em] text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {subtitle}
          </p>
          <p
            className="font-montserrat text-[12px] font-normal leading-[1.33em] text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {text}
          </p>
        </div>

        <Link
          href={link}
          className="flex w-fit items-center justify-center gap-1 rounded-[6px] border border-white px-2 py-2 text-white"
        >
          <span
            className="font-montserrat text-[12px] font-semibold leading-[1.33em]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Shop Now
          </span>
          <Image
            src="/images/promotion/arrow-icon2.svg"
            alt="arrow"
            width={16}
            height={16}
          />
        </Link>
      </div>
    </div>
  );
};

export default PromotionCard;
