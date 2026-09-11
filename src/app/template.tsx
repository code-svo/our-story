import Navigation from '@/components/layout/Navigation';
import FloatingBouquets from '@/components/layout/FloatingBouquets';

export default function MainTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingBouquets />
      <Navigation />
      <main className="flex-1">{children}</main>
    </>
  );
}
