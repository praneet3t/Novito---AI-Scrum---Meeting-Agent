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
        { path: '/', label: 'Dashboard' },
        { path: '/meetings', label: 'Meetings' },
        { path: '/review', label: 'Review Tasks' },
        { path: '/tasks', label: 'All Tasks' },
        { path: '/team', label: 'Team' },
        { path: '/reports', label: 'Reports' },
      ];
    case 'manager':
    case 'product_owner':
      return [
        { path: '/', label: 'Dashboard' },
        { path: '/meetings', label: 'Meetings' },
        { path: '/tasks', label: 'Team Tasks' },
        { path: '/reports', label: 'Reports' },
      ];
    default:
      return [
        { path: '/', label: 'Dashboard' },
        { path: '/tasks', label: 'My Tasks' },
      ];
  }
};

export default function Layout({ children, onLogout }: LayoutProps) {
  const [user] = useState(localStorage.getItem('token') || 'admin');
  const navItems = getNavItems(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Novito</h1>
              <div className="flex space-x-4">
                {navItems.map(item => (
                  <Link key={item.path} to={item.path} className="hover:bg-indigo-700 px-3 py-2 rounded">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-indigo-700 px-3 py-1 rounded capitalize">{user}</span>
              <button onClick={onLogout} className="hover:bg-indigo-700 px-4 py-2 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
