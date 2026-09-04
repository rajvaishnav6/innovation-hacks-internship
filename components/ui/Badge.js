import { cn } from '@/lib/utils';

const VARIANTS = {
  'To Do': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-amber-100 text-amber-700',
  Done: 'bg-emerald-100 text-emerald-700',
  Planning: 'bg-violet-100 text-violet-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  'On Hold': 'bg-slate-200 text-slate-600',
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-rose-100 text-rose-700',
  Overdue: 'bg-rose-100 text-rose-700',
  default: 'bg-slate-100 text-slate-600',
};

export default function Badge({ children, variant }) {
  const classes = VARIANTS[variant] || VARIANTS[children] || VARIANTS.default;
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs font-medium', classes)}>
      {children}
    </span>
  );
}
