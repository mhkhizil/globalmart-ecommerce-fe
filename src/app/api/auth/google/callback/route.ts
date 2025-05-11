import axios from 'axios';
import { google } from 'googleapis';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { SessionData, sessionOptions } from '@/lib/iron-session/session-option';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code is missing' },
      { status: 400 }
    );
  }

  try {
    //************** use google api *******************************/
    // const oauth2Client = new google.auth.OAuth2(
    //   process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    //   process.env.GOOGLE_SECRET,
    //   process.env.GOOGLE_REDIRECT_URL
    // );
    // const tokenResponse = await oauth2Client.getToken(code);

    // Exchange authorization code for tokens
    //************** fetching token manually *******************/
    const tokenResponse = await axios.post(
      GOOGLE_TOKEN_URL,
      new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { id_token, access_token } = tokenResponse.data;

    // TODO: Forward the tokens to your backend
    //   const backendResponse = await axios.post(
    //     process.env.BACKEND_AUTH_URL || '',
    //     {
    //       id_token,
    //       access_token,
    //     }
    //   );

    //   const userSessionToken = backendResponse.data.token;

    // Set session data

    const session = await getIronSession<SessionData>(await cookies(), {
      ...sessionOptions,
    });

    session.token = access_token;
    session.user = {
      user: {
        driver_id: 0,
        merchant_id: 0,
        address: '',
        city_id: '',
        country_id: '',
        created_at: '',
        email: '',
        email_verified_at: '',
        fcm_id: '',
        id: 1,
        image: '',
        latlong: '',
        name: '',
        phone: '',
        phone_code: '',
        postal_code: '',
        roles: 1,
        state_id: '',
        updated_at: '',
      },
    };
    await session.save();
    const redirectUrl = new URL('/application/home', request.url).toString();
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error(
      'OAuth callback error:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
