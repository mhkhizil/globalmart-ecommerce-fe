import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

function SponsorBanner() {
  return (
    <div className="flex flex-col w-full">
      <h2 className="font-medium text-xl mb-2">Sponserd</h2>

      <Link href="/promotions/sale" className="block">
        <motion.div
          className="relative w-full rounded-lg overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Banner Image */}
          <Image
            src="/images/sponsor_banner.png"
            alt="Up to 50% Off promotion"
            width={700}
            height={400}
            className="w-full object-cover"
          />

          {/* Overlay Text */}
          {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-white flex items-center justify-center gap-2">
                <div className="h-[1px] w-16 bg-white"></div>
                <span className="text-xl font-semibold">UP TO</span>
                <div className="h-[1px] w-16 bg-white"></div>
              </div>
              <div className="text-[72px] font-bold text-white leading-none">
                50% OFF
              </div>
              <div className="h-[1px] w-32 bg-white mx-auto mt-4"></div>
            </div>
          </div> */}

          {/* Bottom Text with Arrow */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-white bg-opacity-95">
            <h3 className="font-bold text-base">up to 50% Off</h3>
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Image
                src="/images/arrow_icon.svg"
                alt="Arrow right"
                width={10}
                height={10}
              />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

export default SponsorBanner;
