import Image from 'next/image';

import OnboardingPageSlider from '@/components/module/onboarding/slider';

function OnboardingPageClient() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Background image container with specific styling */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/images/onboarding.wuyoufuwu88.webp')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          // This ensures the image maintains its aspect ratio while filling the screen
          // and keeping the center portion visible on all screen sizes
        }}
      ></div>

      {/* Very subtle overlay for better readability if needed */}
      <div className="absolute inset-0 bg-black bg-opacity-5 z-10"></div>

      {/* Content container */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between items-center">
        {/* Top section for any future content */}
        <div className="w-full p-6">
          {/* You can add a logo or header text here if needed */}
        </div>

        {/* Bottom section with slider */}
        <div className="w-full px-2 pb-6">
          <OnboardingPageSlider />
        </div>
      </div>
    </div>
  );
}
export default OnboardingPageClient;
