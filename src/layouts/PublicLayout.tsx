import {
  useState,
} from 'react';

import {
  Link,
  Outlet,
  useLocation,
} from 'react-router-dom';

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Teams',
      path: '/teams',
    },
    {
      name: 'Fixtures',
      path: '/fixtures',
    },
    {
      name: 'Results',
      path: '/results',
    },
    {
      name: 'Standings',
      path: '/standings',
    }, 
    {
      name: 'Announcements',
      path: '/announcements',
    },
    {
      name: 'Tournament Gallery',
      path: '/gallery',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-lg">
              ⚽
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                Mokamtola
              </p>

              <p className="text-xs text-slate-500">
                eFootball Tournament
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-1 md:flex">

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive(item.path)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.name}
              </Link>
            ))}

          </nav>

          {/* Login */}

          <Link
            to="/login"
            className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 md:block"
          >
            Admin Login
          </Link>

          {/* Mobile Button */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="rounded-lg p-2 text-2xl text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>

        {/* Mobile Navigation */}

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">

            <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">

              <div className="flex flex-col gap-1">

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  to="/login"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Admin Login
                </Link>

              </div>

            </nav>

          </div>
        )}

      </header>

      {/* Main Content */}

      <main className="min-h-[calc(100vh-136px)]">
        <Outlet />
      </main>

      {/* Footer */}

      <footer className="border-t border-slate-200 bg-slate-900 text-white">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-bold">
                ⚽ Mokamtola eFootball
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Tournament Management System
              </p>
            </div>

            <p className="text-sm text-slate-400">
              © 2026 Mokamtola eFootball
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default PublicLayout;