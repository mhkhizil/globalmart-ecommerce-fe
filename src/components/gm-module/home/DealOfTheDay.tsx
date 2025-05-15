'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
};

const formatTime = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`;
};

const DealOfTheDay = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 22,
    minutes: 55,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(previousTime => {
        let { hours, minutes, seconds } = previousTime;

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="flex w-full items-center justify-between bg-[#4392F9] rounded-lg p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-['Montserrat'] font-medium text-white text-base leading-5">
          Deal of the Day
        </h2>
        <div className="flex items-center gap-1">
          <Image src="/images/clock.svg" alt="Clock" width={16} height={16} />
          <span className="font-['Montserrat'] font-normal text-white text-xs leading-4">
            {formatTime(timeRemaining.hours)}h{' '}
            {formatTime(timeRemaining.minutes)}m{' '}
            {formatTime(timeRemaining.seconds)}s remaining
          </span>
        </div>
      </div>
      <Link
        href="#"
        className="flex items-center gap-1 border border-white rounded px-[10px] py-[6px]"
      >
        <span className="font-['Montserrat'] font-semibold text-white text-xs leading-4">
          View all
        </span>
        <Image src="/images/arrow.svg" alt="Arrow" width={16} height={16} />
      </Link>
    </motion.div>
  );
};

export default DealOfTheDay;
