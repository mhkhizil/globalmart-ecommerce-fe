import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || ''
    );

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
    });
    return NextResponse.redirect(authorizationUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid action' }, { status: 404 });
  }
}
