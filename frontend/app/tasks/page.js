'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { getTasks, getProjects, createTask, updateTaskStatus } from '@/lib/api';
import SearchInput from '@/components/ui/SearchInput';
import FilterSelect from '@/components/ui/FilterSelect';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { RowSkeleton } from '@/components/ui/Skeleton';
import TaskCard from '@/components/dashboard/TaskCard';
import NewTaskModal from '@/components/dashboard/NewTaskModal';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const STATUS_COLUMNS = [
  { key: 'To Do', label: 'to do' },
  { key: 'In Progress', label: 'in progress' },
  { key: 'Done', label: 'done' },
];
const STATUS_ORDER = ['To Do', 'In Progress', 'Done'];

export default function TasksPage() {
  const { data, status, error, retry } = useAsync(() => getTasks(), []);
  const projectsState = useAsync(() => getProjects(), []);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const enriched = useMemo(() => {
    if (!data) return [];
    const byId = Object.fromEntries((projectsState.data || []).map((p) => [p.id, p.name]));
    return data.map((t) => ({ ...t, projectName: byId[t.projectId] || 'Unknown project' }));
  }, [data, projectsState.data]);

  const filtered = useMemo(() => {
    return enriched.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [enriched, search, priorityFilter]);

  const handleCreate = async (formData) => {
    setCreateError('');
    setCreating(true);
    try {
      await createTask(formData);
      setModalOpen(false);
      retry();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const cycleStatus = async (task) => {
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(task.status) + 1) % STATUS_ORDER.length];
    try {
      await updateTaskStatus(task.id, next);
      retry();
    } catch (err) {
      console.error('Failed to update task status:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-mono text-2xl font-semibold text-slate-800">tasks</h2>
          <p className="text-sm text-slate-500">Track work across every project in one place.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." />
        <FilterSelect value={priorityFilter} onChange={setPriorityFilter} options={PRIORITY_OPTIONS} label="Priority" />
      </div>

      {status === 'error' && <ErrorState message={error} onRetry={retry} />}

      {status === 'loading' && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      )}

      {status === 'success' && filtered.length === 0 && (
        <EmptyState title="No tasks found" description="Try a different search term or filter." />
      )}

      {status === 'success' && filtered.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Click any task to move it to the next status.</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {STATUS_COLUMNS.map(({ key, label }) => {
              const colTasks = filtered.filter((t) => t.status === key);
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-mono text-sm font-semibold text-slate-600">{label}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {colTasks.length === 0 ? (
                      <p className="px-4 py-6 text-xs text-center border border-dashed rounded-xl border-slate-200 text-slate-400">
                        Nothing here
                      </p>
                    ) : (
                      colTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => cycleStatus(task)}
                          className="block w-full text-left"
                        >
                          <TaskCard task={task} />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <NewTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        projects={projectsState.data || []}
        loading={creating}
        error={createError}
      />
    </div>
  );
}