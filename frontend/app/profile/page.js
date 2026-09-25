'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { getProjects, getTasks } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { Mail, Calendar, Briefcase, Pencil } from 'lucide-react';
import EditProfileModal from '@/components/dashboard/EditProfileModal';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const projectsState = useAsync(() => getProjects(), []);
  const tasksState = useAsync(() => getTasks(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const completedTasks = useMemo(
    () => (tasksState.data || []).filter((t) => t.status === 'Done').length,
    [tasksState.data]
  );

  const handleSave = async (formData) => {
    setSaveError('');
    setSaving(true);
    try {
      await updateProfile(formData);
      setModalOpen(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.role}</p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
        {user.bio && <p className="mt-4 text-sm text-slate-600">{user.bio}</p>}
      </div>

      <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-100">
        <h3 className="mb-4 font-mono text-sm font-semibold tracking-wide uppercase text-slate-400">details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{user.role}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 text-center bg-white border shadow-sm rounded-xl border-slate-100">
          <p className="font-mono text-2xl font-semibold text-slate-800">{projectsState.data?.length ?? '—'}</p>
          <p className="text-sm text-slate-500">Active Projects</p>
        </div>
        <div className="p-5 text-center bg-white border shadow-sm rounded-xl border-slate-100">
          <p className="font-mono text-2xl font-semibold text-slate-800">{completedTasks}</p>
          <p className="text-sm text-slate-500">Tasks Completed</p>
        </div>
      </div>

      <EditProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        loading={saving}
        error={saveError}
        user={user}
      />
    </div>
  );
}