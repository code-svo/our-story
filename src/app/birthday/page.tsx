import { getSettings } from '@/lib/data';
import BirthdayClient from '@/components/birthday/BirthdayClient';

export default async function BirthdayPage() {
  const settings = await getSettings();

  return (
    <BirthdayClient
      name={settings.birthday_name}
      message={settings.birthday_message}
    />
  );
}
