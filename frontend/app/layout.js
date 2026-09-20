import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'DevBoard - Developer Productivity Dashboard',
  description:
    'A productivity dashboard for tracking projects and tasks. Built for the Innovation Hacks Full Stack Development Internship.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}