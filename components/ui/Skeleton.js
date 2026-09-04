import { cn } from '@/lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5">
      <Skeleton className="mb-3 h-4 w-2/3" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-4 h-3 w-4/5" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}
