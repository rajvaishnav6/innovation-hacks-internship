import { cn } from '@/lib/utils';

export default function StatCard({ label, value, icon: Icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'bg-cyan-50 text-cyan-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-mono text-2xl font-semibold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
