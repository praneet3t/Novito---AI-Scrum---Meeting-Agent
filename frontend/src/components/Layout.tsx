import { Link } from 'react-router-dom';
import { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const getNavItems = (role: string) => {
  switch(role) {
    case 'admin':
      return [
        { path: '/executive', label: 'Executive Brief' },
        { path: '/chat', label: 'Intelligence' },
        { path: '/', label: 'Dashboard' },
        { path: '/meetings', label: 'Meetings' },
        { path: '/review', label: 'Review' },
        { path: '/tasks', label: 'Tasks' },
        { path: '/smart', label: 'Actions' },
        { path: '/analytics', label: 'Analytics' },
        { path: '/audit', label: 'Audit' },
        { path: '/settings', label: 'Settings' },
      ];
    case 'manager':
    case 'product_owner':
      return [
        { path: '/executive', label: 'Executive Brief' },
        { path: '/chat', label: 'Intelligence' },
        { path: '/', label: 'Dashboard' },
        { path: '/meetings', label: 'Meetings' },
        { path: '/review', label: 'Review' },
        { path: '/tasks', label: 'Tasks' },
        { path: '/blockers', label: 'Blockers' },
        { path: '/analytics', label: 'Analytics' },
      ];
    default:
      return [
        { path: '/briefing', label: 'Briefing' },
        { path: '/chat', label: 'Ask AI' },
        { path: '/', label: 'Dashboard' },
        { path: '/tasks', label: 'My Tasks' },
      ];
  }
};

export default function Layout({ children, onLogout }: LayoutProps) {
  const [user] = useState(localStorage.getItem('token') || 'admin');
  const navItems = getNavItems(user);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <nav style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} className="text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold tracking-tight">Novito</h1>
              <div className="flex space-x-1">
                {navItems.map(item => (
                  <Link key={item.path} to={item.path} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm px-3 py-1.5 rounded-lg capitalize" style={{ background: 'rgba(255,255,255,0.15)' }}>{user}</span>
              <button onClick={onLogout} className="text-sm px-4 py-1.5 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
