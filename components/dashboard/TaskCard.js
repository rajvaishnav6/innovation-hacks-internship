import Badge from '@/components/ui/Badge';
import { formatDate, isOverdue } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export default function TaskCard({ task }) {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-800">{task.title}</p>
        <p className="text-xs text-slate-400">{task.projectName}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {overdue && <Badge variant="Overdue">Overdue</Badge>}
        <Badge variant={task.priority}>{task.priority}</Badge>
        <Badge variant={task.status}>{task.status}</Badge>
        <span className="flex items-center gap-1 font-mono text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}
