import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session) {
    return NextResponse.json({});
  }
  return NextResponse.json({ token: session.token });
}
