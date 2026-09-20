import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <Icon className="mb-3 h-10 w-10 text-slate-300" />
      <p className="font-medium text-slate-600">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>}
    </div>
  );
}
