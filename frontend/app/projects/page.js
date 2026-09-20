'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { getProjects, getTasks, createProject } from '@/lib/api';
import ProjectCard from '@/components/dashboard/ProjectCard';
import SearchInput from '@/components/ui/SearchInput';
import FilterSelect from '@/components/ui/FilterSelect';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import NewProjectModal from '@/components/dashboard/NewProjectModal';
import GenerateTasksModal from '@/components/dashboard/GenerateTasksModal';
import { getProjectStats } from '@/lib/utils';

const STATUS_OPTIONS = ['Planning', 'In Progress', 'Completed', 'On Hold'];

export default function ProjectsPage() {
  const { data, status, error, retry } = useAsync(() => getProjects(), []);
  const tasksState = useAsync(() => getTasks(), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [aiProject, setAiProject] = useState(null);

  const withStats = useMemo(() => {
    if (!data || !tasksState.data) return data || [];
    return data.map((p) => ({ ...p, ...getProjectStats(p, tasksState.data) }));
  }, [data, tasksState.data]);

  const filtered = useMemo(() => {
    return withStats.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [withStats, search, statusFilter]);

  const handleCreate = async (formData) => {
    setCreateError('');
    setCreating(true);
    try {
      await createProject(formData);
      setModalOpen(false);
      retry();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleTasksCreated = () => {
    tasksState.retry();
    retry();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-mono text-2xl font-semibold text-slate-800">projects</h2>
          <p className="text-sm text-slate-500">All the projects you&apos;re currently tracking.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} label="Status" />
      </div>

      {status === 'error' && <ErrorState message={error} onRetry={retry} />}

      {status === 'loading' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === 'success' && filtered.length === 0 && (
        <EmptyState
          title="No projects found"
          description="Try adjusting your search or filters, or create a new project."
        />
      )}

      {status === 'success' && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onGenerateTasks={setAiProject} />
          ))}
        </div>
      )}

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        loading={creating}
        error={createError}
      />

      <GenerateTasksModal
        open={!!aiProject}
        onClose={() => setAiProject(null)}
        project={aiProject}
        onTasksCreated={handleTasksCreated}
      />
    </div>
  );
}