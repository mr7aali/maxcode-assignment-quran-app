import { Skeleton } from '@/components/ui/Skeleton';

export function AyahSkeleton() {
  return (
    <div className="border-b border-border-default px-6 py-7">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <Skeleton className="mb-5 ml-auto h-10 w-4/5" />
      <Skeleton className="ml-auto h-10 w-2/3" />
      <Skeleton className="mt-6 h-5 w-3/4" />
    </div>
  );
}
