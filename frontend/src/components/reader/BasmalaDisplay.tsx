import { cn } from '@/lib/utils';

interface BasmalaDisplayProps {
  className?: string;
}

export function BasmalaDisplay({ className }: BasmalaDisplayProps) {
  return (
    <div className={cn('arabic-text text-center text-3xl text-accent-gold md:text-4xl', className)} dir="rtl">
      بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
    </div>
  );
}
