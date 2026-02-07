import { Outlet, NavLink } from 'react-router-dom';
import { Home, History, User } from 'lucide-react';

export default function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 text-xs transition-colors ${
      isActive ? 'text-primary-600 font-semibold' : 'text-gray-400'
    }`;

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="border-t border-gray-200 bg-white px-6 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-md justify-around">
          <NavLink to="/" className={linkClass}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            <History className="h-5 w-5" />
            <span>History</span>
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            <User className="h-5 w-5" />
            <span>Profile</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
