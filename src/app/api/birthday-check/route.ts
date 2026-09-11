import { NextResponse } from 'next/server';
import { demoSettings } from '@/lib/demo-data';

// Check if today is the birthday
export async function GET() {
  const birthday = new Date(demoSettings.birthday);
  const now = new Date();

  const isBirthday =
    now.getMonth() === birthday.getMonth() &&
    now.getDate() === birthday.getDate();

  return NextResponse.json({
    isBirthday,
    birthdayName: demoSettings.birthday_name,
  });
}
