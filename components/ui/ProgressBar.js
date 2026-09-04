import { cn } from '@/lib/utils';

export default function ProgressBar({ value, className }) {
  const clamped = Math.min(100, Math.max(0, value));
  const colorClass = clamped === 100 ? 'bg-emerald-500' : clamped >= 50 ? 'bg-cyan-500' : 'bg-amber-500';
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-2 rounded-full transition-all duration-500', colorClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
