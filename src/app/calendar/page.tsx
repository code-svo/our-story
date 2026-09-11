import { getSpecialDates, getMemories } from '@/lib/data';
import CalendarClient from '@/components/calendar/CalendarClient';

export default async function CalendarPage() {
  const specialDates = await getSpecialDates();
  const memories = await getMemories();

  return <CalendarClient specialDates={specialDates} memories={memories} />;
}
