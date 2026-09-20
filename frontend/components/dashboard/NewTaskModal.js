'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

export default function NewTaskModal({ open, onClose, onCreate, projects = [], loading = false, error = '' }) {
  const emptyForm = { title: '', projectId: '', status: 'To Do', priority: 'Medium', dueDate: '' };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, projectId: projects[0]?.id || '' });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Task title is required.';
    if (!form.projectId) nextErrors.projectId = 'Please choose a project.';
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-lg font-semibold text-slate-800">new task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="px-3 py-2 mb-4 text-sm border rounded-lg border-rose-100 bg-rose-50 text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-600">Task title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              placeholder="e.g. Fix login redirect bug"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-600">Project</label>
            <select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="">Choose a project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="mt-1 text-xs text-rose-500">{errors.projectId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-600">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-600">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg border-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
            {errors.dueDate && <p className="mt-1 text-xs text-rose-500">{errors.dueDate}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}