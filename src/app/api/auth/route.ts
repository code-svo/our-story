import { NextRequest, NextResponse } from 'next/server';
import { demoSettings } from '@/lib/demo-data';
import { getAuthCookieConfig } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();

    // Validate passcode against settings
    const correctPasscode = demoSettings.passcode;

    if (passcode === correctPasscode) {
      const cookieConfig = getAuthCookieConfig();
      const response = NextResponse.json({ success: true });
      response.cookies.set(cookieConfig);
      return response;
    }

    return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
