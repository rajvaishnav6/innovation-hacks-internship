'use client';

import { useMemo } from 'react';
import { LayoutDashboard, ListChecks, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { getProjects, getTasks } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TaskCard from '@/components/dashboard/TaskCard';
import { CardSkeleton, RowSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { isOverdue, getProjectStats } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const projectsState = useAsync(() => getProjects(), []);
  const tasksState = useAsync(() => getTasks(), []);

  const stats = useMemo(() => {
    if (!projectsState.data || !tasksState.data) return null;
    return {
      totalProjects: projectsState.data.length,
      inProgress: tasksState.data.filter((t) => t.status === 'In Progress').length,
      completed: tasksState.data.filter((t) => t.status === 'Done').length,
      overdue: tasksState.data.filter((t) => isOverdue(t.dueDate, t.status)).length,
    };
  }, [projectsState.data, tasksState.data]);

  const upcomingTasks = useMemo(() => {
    if (!tasksState.data) return [];
    const byId = Object.fromEntries((projectsState.data || []).map((p) => [p.id, p.name]));
    return [...tasksState.data]
      .filter((t) => t.status !== 'Done')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
      .map((t) => ({ ...t, projectName: byId[t.projectId] || 'Unknown project' }));
  }, [tasksState.data, projectsState.data]);

  const recentProjects = useMemo(() => {
    if (!projectsState.data || !tasksState.data) return [];
    return projectsState.data.slice(0, 3).map((p) => ({ ...p, ...getProjectStats(p, tasksState.data) }));
  }, [projectsState.data, tasksState.data]);

  const loading = projectsState.status === 'loading' || tasksState.status === 'loading';
  const error = projectsState.status === 'error' || tasksState.status === 'error';

  const retry = () => {
    projectsState.retry();
    tasksState.retry();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across your projects today.</p>
      </div>

      {error && <ErrorState message={projectsState.error || tasksState.error} onRetry={retry} />}

      {!error && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading || !stats ? (
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              <>
                <StatCard label="Total Projects" value={stats.totalProjects} icon={LayoutDashboard} tone="cyan" />
                <StatCard label="Tasks In Progress" value={stats.inProgress} icon={ListChecks} tone="amber" />
                <StatCard label="Tasks Completed" value={stats.completed} icon={CheckCircle2} tone="emerald" />
                <StatCard label="Overdue Tasks" value={stats.overdue} icon={AlertTriangle} tone="rose" />
              </>
            )}
          </section>

          <section>
            <h3 className="mb-4 font-mono text-lg font-semibold text-slate-800">recent projects</h3>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <EmptyState title="No projects yet" description="Create your first project to see it here." />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-4 font-mono text-lg font-semibold text-slate-800">upcoming tasks</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <RowSkeleton key={i} />
                ))}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <EmptyState title="All caught up!" description="You have no pending tasks right now." />
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}