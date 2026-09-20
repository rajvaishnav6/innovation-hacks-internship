import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatDate } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function ProjectCard({ project, onGenerateTasks }) {
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
          {onGenerateTasks && (
            <button
              onClick={() => onGenerateTasks(project)}
              className="flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100"
            >
              <Sparkles className="w-3 h-3" />
              AI tasks
            </button>
          )}
        </div>
      </div>
    </div>
  );
}