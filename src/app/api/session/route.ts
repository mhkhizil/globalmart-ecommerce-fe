import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  // if (!session) {
  //   return NextResponse.json({});
  // }
  // return NextResponse.json({ user: session.user });
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Surrogate-Control', 'no-store');
  headers.set('Keep-Alive', 'timeout=30');

  if (!session) {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers,
    });
  }

  // Generate response body
  const responseBody = JSON.stringify({ user: session.user });

  // Set Content-Length explicitly for GET
  headers.set('Content-Length', Buffer.byteLength(responseBody).toString());

  return new NextResponse(responseBody, {
    status: 200,
    headers,
  });
}

export async function POST(request: NextRequest) {
  const { token, ...user } = await request.json();
  const session = await getIronSession<SessionData>(await cookies(), {
    ...sessionOptions,
  });

  session.token = token;
  session.user = user;
  await session.save();
  return NextResponse.json(session);
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.destroy();
  return NextResponse.json({ message: 'log out successfully' });
}
