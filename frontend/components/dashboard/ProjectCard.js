import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatDate } from '@/lib/utils';
import { Sparkles, Pencil, Trash2 } from 'lucide-react';

export default function ProjectCard({ project, onGenerateTasks, onEdit, onDelete }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-800">{project.name}</h3>
        <Badge variant={project.status}>{project.status}</Badge>
      </div>
      <p className="mb-4 text-sm line-clamp-2 text-slate-500">{project.description}</p>
      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-slate-500">
          <span>
            {project.tasksCompleted}/{project.tasksTotal} tasks
          </span>
          <span>{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
        <div className="flex items-center justify-between pt-1">
          <p className="font-mono text-xs text-slate-400">due {formatDate(project.dueDate)}</p>
          <div className="flex items-center gap-1.5">
            {onGenerateTasks && (
              <button
                onClick={() => onGenerateTasks(project)}
                className="flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100"
              >
                <Sparkles className="w-3 h-3" />
                AI tasks
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Edit project"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Delete project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}