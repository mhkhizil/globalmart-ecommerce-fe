'use client';
import { motion } from 'framer-motion';

function GetStarted() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src="/images/background.png"
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-63"></div>

      {/* Status Bar */}
      {/* <div className="absolute top-0 z-10 flex w-full items-center justify-between px-5 py-3">
        <div className="text-center">
          <p className="font-poppins text-[15px] font-medium text-white">
            9:41
          </p>
        </div>
        <div className="flex items-center gap-2">
          <svg
            width="17"
            height="12"
            viewBox="0 0 17 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 0.5H16C16.2761 0.5 16.5 0.723858 16.5 1V11C16.5 11.2761 16.2761 11.5 16 11.5H1C0.723858 11.5 0.5 11.2761 0.5 11V1C0.5 0.723858 0.723858 0.5 1 0.5ZM1.5 1.5V10.5H15.5V1.5H1.5Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.5 3.5H14.5V8.5H13.5V3.5ZM11.5 5.5H12.5V8.5H11.5V5.5ZM9.5 7.5H10.5V8.5H9.5V7.5Z"
              fill="white"
            />
          </svg>
          <svg
            width="15"
            height="12"
            viewBox="0 0 15 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 2.5C9.5 2.5 11.2 3.6 12.2 5.3C12.3 5.5 12.6 5.5 12.7 5.3C13.7 3.6 15.4 2.5 17.4 2.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.3 5.3C2.3 3.6 4 2.5 6 2.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.95 5.3C3.4 6.3 3.1 7.4 3.1 8.6C3.1 9.8 3.4 10.9 3.95 11.9C4.05 12.1 4.35 12.1 4.45 11.9C5 10.9 5.3 9.8 5.3 8.6C5.3 7.4 5 6.3 4.45 5.3C4.35 5.1 4.05 5.1 3.95 5.3Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.45 5.3C9.9 6.3 9.6 7.4 9.6 8.6C9.6 9.8 9.9 10.9 10.45 11.9C10.55 12.1 10.85 12.1 10.95 11.9C11.5 10.9 11.8 9.8 11.8 8.6C11.8 7.4 11.5 6.3 10.95 5.3C10.85 5.1 10.55 5.1 10.45 5.3Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.2 5.3C6.65 6.3 6.35 7.4 6.35 8.6C6.35 9.8 6.65 10.9 7.2 11.9C7.3 12.1 7.6 12.1 7.7 11.9C8.25 10.9 8.55 9.8 8.55 8.6C8.55 7.4 8.25 6.3 7.7 5.3C7.6 5.1 7.3 5.1 7.2 5.3Z"
              fill="white"
            />
          </svg>
          <div className="flex items-center">
            <div className="h-[11.5px] w-[22px] rounded-[2.7px] border border-white opacity-35"></div>
            <div className="mr-[1px] h-[7.5px] w-[18px] translate-x-[2px] rounded-[1.3px] bg-white"></div>
            <div className="h-[4px] w-[1.5px] translate-x-[1px] bg-white opacity-40"></div>
          </div>
        </div>
      </div> */}

      {/* Content Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center px-6 text-center"
        >
          <h1 className="mb-4 font-['Montserrat'] text-[34px] font-semibold leading-[1.22em] tracking-[0.01em] text-white">
            Shop smarter, faster, and with exclusive deals just for you.
          </h1>
          <p className="mb-10 font-['Montserrat'] text-[14px] font-bold leading-[1.54em] tracking-[0.01em] text-[#F2F2F2]">
            Find it here, buy it now!
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileTap={{ scale: 0.95 }}
          className="mx-auto mt-2 flex h-[55px] w-[279px] items-center justify-center rounded-[4px] bg-[#F83758] px-2 py-[21px]"
        >
          <span className="font-['Montserrat'] text-[23px] font-semibold leading-[1.22em] text-white">
            Get Started
          </span>
        </motion.button>
      </div>

      {/* Home Indicator */}
      {/* <div className="absolute bottom-0 w-full">
        <div className="mx-auto my-2 h-[5px] w-[134px] rounded-[2.5px] bg-white bg-opacity-50"></div>
      </div> */}
    </div>
  );
}

export default GetStarted;
