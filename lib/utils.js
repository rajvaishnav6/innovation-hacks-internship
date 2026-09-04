export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

export function getProjectStats(project, tasks) {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const tasksTotal = projectTasks.length;
  const tasksCompleted = projectTasks.filter((t) => t.status === 'Done').length;
  const progress = tasksTotal === 0 ? 0 : Math.round((tasksCompleted / tasksTotal) * 100);
  return { tasksTotal, tasksCompleted, progress };
}

const AVATAR_PALETTE = [
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
];

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function getAvatarColors(name) {
  const index = name.charCodeAt(0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}