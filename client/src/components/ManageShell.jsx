import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['/manage', 'Leads', true],
  ['/manage/analytics', 'Analytics', false],
  ['/manage/blog', 'Blog', false],
  ['/manage/apr-settings', 'APR Settings', false],
];

/** Shared chrome for all staff pages: top bar + nav + logout. */
export default function ManageShell({ title, actions, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate('/manage/login');
  };

  return (
    <div className="min-h-screen bg-lightbg">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/manage" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-bold text-white">L</span>
            <span className="font-bold text-primary">Admin Console</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline">Hi, {user?.username}</span>
            <button onClick={doLogout} className="btn-ghost !px-4 !py-2 text-sm">
              Logout
            </button>
          </div>
        </div>
        <div className="container-x flex gap-1 overflow-x-auto pb-2">
          {links.map(([to, label, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-accent text-white' : 'text-slate-600 hover:bg-lightbg'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="container-x py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <div className="flex gap-2">{actions}</div>
        </div>
        {children}
      </main>
    </div>
  );
}
