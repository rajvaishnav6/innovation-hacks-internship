'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { generateTasks, createTask } from '@/lib/api';
import Badge from '@/components/ui/Badge';

export default function GenerateTasksModal({ open, onClose, project, onTasksCreated }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !project) return;
    setSuggestions([]);
    setSelected({});
    setError('');
    setLoading(true);
    generateTasks(project.id)
      .then((result) => {
        setSuggestions(result.suggestions);
        setSelected(Object.fromEntries(result.suggestions.map((_, i) => [i, true])));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, project]);

  if (!open) return null;

  const toggle = (index) => {
    setSelected((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAdd = async () => {
    setSaving(true);
    setError('');
    try {
      const chosen = suggestions.filter((_, i) => selected[i]);
      await Promise.all(
        chosen.map((s) =>
          createTask({ title: s.title, projectId: project.id, priority: s.priority || 'Medium' })
        )
      );
      onTasksCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-mono text-lg font-semibold text-slate-800">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            ai task suggestions
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          For <span className="font-medium text-slate-700">{project?.name}</span>
        </p>

        {error && (
          <div className="px-3 py-2 mb-4 text-sm border rounded-lg border-rose-100 bg-rose-50 text-rose-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Asking AI for suggestions...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 overflow-y-auto max-h-72">
              {suggestions.map((s, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer border-slate-100 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={!!selected[i]}
                    onChange={() => toggle(i)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="flex-1 text-sm text-slate-700">{s.title}</span>
                  <Badge variant={s.priority}>{s.priority}</Badge>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || selectedCount === 0}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : `Add ${selectedCount} task${selectedCount !== 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}