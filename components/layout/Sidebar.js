'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, ListChecks, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'projects', icon: FolderKanban },
  { href: '/tasks', label: 'tasks', icon: ListChecks },
  { href: '/profile', label: 'profile', icon: User },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-800 bg-slate-900 transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-1.5 font-mono text-slate-100">
            <span className="text-cyan-400">&gt;</span>
            <span className="font-semibold">devboard</span>
            <span className="cursor-blink text-cyan-400">_</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm transition',
                  active
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>
                  {active ? '> ' : ''}
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
