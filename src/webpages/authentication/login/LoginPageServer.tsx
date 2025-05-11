import { getIronSession } from 'iron-session';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import FallBackLoading from '@/components/common/loader/FallBackLoading';
import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';

import LoginPageClient from './LoginPageClient';

// Move revalidation to a server action
export async function revalidateHomePage() {
  'use server';
  revalidatePath('/');
}

async function LoginPageServer({ locale }: { locale: string }) {
  const { user } = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  let data: any = user;
  // console.log(user?.user?.roles);
  if (user) {
    if (user?.user?.roles === 1) {
      redirect('/application/home');
    }
    if (user?.user?.roles === 2) {
      redirect('/application/merchant-home');
    }
  }
  return <LoginPageClient locale={locale} />;
}

export default function LoginPageServerWithSuspense({
  locale,
}: {
  locale: string;
}) {
  return (
    <Suspense fallback={<FallBackLoading />}>
      <LoginPageServer locale={locale} />
    </Suspense>
  );
}
