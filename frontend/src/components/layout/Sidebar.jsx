import { Link, NavLink } from "react-router-dom";
import { Bell, Code2, Home, MessageCircle, UserRound, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar() {
  const { user } = useAuth();
  const navigationLinks = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/network", label: "My Network", icon: Users },
    { to: "/build", label: "Build With Me", icon: Code2 },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="hidden space-y-4 md:block">
      <section className="card overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-purple" />
        <Link to={`/profile/${user?.username}`} className="-mt-8 flex flex-col items-center px-4 pb-4 text-center">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="h-16 w-16 rounded-full border-4 border-white bg-white object-cover" />
          ) : (
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-indigo-50 text-xl font-bold text-brand-indigo shadow-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <h2 className="mt-2 font-semibold text-ink-primary">{user?.name}</h2>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-secondary">
            {user?.headline || "Add a headline to introduce yourself"}
          </p>
        </Link>
        <Link
          to={`/profile/${user?.username}`}
          className="border-t border-border-subtle px-4 py-3 text-center text-sm font-semibold text-brand-indigo transition-colors hover:bg-surface-bg"
        >
          View profile
        </Link>
      </section>

      <section className="card p-2">
        <p className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
          Your workspace
        </p>
        <nav className="flex flex-col gap-1">
          {navigationLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-indigo/10 text-brand-indigo"
                    : "text-ink-secondary hover:bg-surface-bg hover:text-ink-primary"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <NavLink
            to={`/profile/${user?.username}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-indigo/10 text-brand-indigo"
                  : "text-ink-secondary hover:bg-surface-bg hover:text-ink-primary"
              }`
            }
          >
            <UserRound size={18} />
            My Profile
          </NavLink>
        </nav>
      </section>
    </aside>
  );
}
