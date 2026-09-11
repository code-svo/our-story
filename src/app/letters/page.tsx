import { getLetters } from '@/lib/data';
import LettersClient from '@/components/letters/LettersClient';

export default async function LettersPage() {
  const letters = await getLetters();

  return <LettersClient letters={letters} />;
}
