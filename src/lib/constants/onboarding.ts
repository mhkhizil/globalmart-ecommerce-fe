import { useTranslations } from 'next-intl';

export const getOnboardingSlides = (t: ReturnType<typeof useTranslations>) => [
  {
    image: '/images/onboarding.wuyoufuwu88-1.png',
    title: t('onboarding.s1.header'),
    description: t('onboarding.s1.content'),
  },
  {
    image: '/images/onboarding.wuyoufuwu88-2.png',
    title: t('onboarding.s2.header'),
    description: t('onboarding.s2.content'),
  },
  {
    image: '/images/onboarding.wuyoufuwu88-3.png',
    title: t('onboarding.s3.header'),
    description: t('onboarding.s3.content'),
  },
];
