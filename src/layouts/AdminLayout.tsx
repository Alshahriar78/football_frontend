import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { authStorage } from '../utils/auth';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authStorage.removeToken();
    window.location.href = '/login';
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: '📊',
    },
    {
      label: 'Tournaments',
      path: '/admin/tournaments',
      icon: '🏆',
    },
    {
      label: 'Teams',
      path: '/admin/teams',
      icon: '👥',
    },
    {
      label: 'Matches',
      path: '/admin/matches',
      icon: '⚽',
    },
    {
      label: 'Results',
      path: '/admin/results',
      icon: '🏆',
    },
    {
      label: 'Announcements',
      path: '/admin/announcements',
      icon: '📢',
    },
    {
      label: 'Banners',
      path: '/admin/banners',
      icon: '🖼️',
    },
    {
      label: 'Gallery',
      path: '/admin/gallery',
      icon: '📸',
    },
    {
      label: 'Sponsors',
      path: '/admin/sponsors',
      icon: '🤝',
    },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-800 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-xl text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>

        <Link
          to="/admin"
          className="text-sm font-bold text-slate-900 sm:text-base"
        >
          ⚽ Mokamtola Admin
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
          <Link to="/admin" className="min-w-0">
            <p className="truncate text-lg font-bold text-white">
              ⚽ Mokamtola
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              eFootball Tournament
            </p>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Management
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:pl-72">
        {/* Desktop Top Bar */}
        <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
          <div>
            <p className="text-sm text-slate-500">Admin Panel</p>

            <h1 className="text-lg font-bold text-slate-900">
              Tournament Management
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;