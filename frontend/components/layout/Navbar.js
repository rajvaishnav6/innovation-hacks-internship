'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Bell, LogOut } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { getTasks } from '@/lib/api';
import { isOverdue, formatDate } from '@/lib/utils';

export default function Navbar({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    getTasks()
      .then((tasks) => setOverdueTasks(tasks.filter((t) => isOverdue(t.dueDate, t.status))))
      .catch(() => setOverdueTasks([]));
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 border-b border-slate-100 bg-white/80 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {overdueTasks.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-20 p-2 mt-2 bg-white border shadow-lg w-72 rounded-xl border-slate-100">
                <p className="px-3 py-2 text-xs font-semibold tracking-wide uppercase text-slate-400">
                  Overdue tasks
                </p>
                {overdueTasks.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-center text-slate-400">You&apos;re all caught up!</p>
                ) : (
                  <div className="space-y-1 overflow-y-auto max-h-64">
                    {overdueTasks.map((task) => (
                      <div key={task.id} className="px-3 py-2 rounded-lg hover:bg-slate-50">
                        <p className="text-sm font-medium truncate text-slate-700">{task.title}</p>
                        <p className="text-xs text-rose-500">was due {formatDate(task.dueDate)}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="h-px my-1 bg-slate-100" />
                <Link
                  href="/tasks"
                  onClick={() => setNotifOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-center rounded-lg text-cyan-600 hover:bg-cyan-50"
                >
                  View all tasks
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50"
          >
            <Avatar name={user.name} size="sm" />
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 w-56 p-2 mt-2 bg-white border shadow-lg rounded-xl border-slate-100">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs truncate text-slate-400">{user.email}</p>
                </div>
                <div className="h-px my-1 bg-slate-100" />
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  View profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}