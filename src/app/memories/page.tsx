import { getMemories } from '@/lib/data';
import MemoriesClient from '@/components/memories/MemoriesClient';

export default async function MemoriesPage() {
  const memories = await getMemories();

  return <MemoriesClient memories={memories} />;
}
