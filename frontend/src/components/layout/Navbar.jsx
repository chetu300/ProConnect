import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Code2, Home, LogOut, MessageCircle, UserRound, UsersRound } from "lucide-react";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocketNotifications } from "../../context/SocketContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { hasNewMessage, hasNewNotification } = useSocketNotifications();
  const navigate = useNavigate();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const initials = user?.name?.trim()?.[0]?.toUpperCase() || "U";
  const links = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/network", label: "Network", icon: UsersRound },
    { to: "/build", label: "Build", icon: Code2 },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  async function handleLogout() {
    await logout();
    setAccountMenuOpen(false);
    navigate("/login");
  }

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setAccountMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  function renderLinks(compact = false) {
    return links.map(({ to, label, icon: Icon, end }) => {
      const hasNewActivity =
        (to === "/messages" && hasNewMessage) ||
        (to === "/notifications" && hasNewNotification);
      const accessibleLabel = hasNewActivity
        ? `${label}, new ${to === "/messages" ? "message" : "notification"}`
        : label;

      return (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={accessibleLabel}
          className={({ isActive }) =>
            `flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-brand-indigo/10 text-brand-indigo"
                : "text-ink-secondary hover:bg-surface-bg hover:text-ink-primary"
            }`
          }
        >
          <span className="relative inline-flex">
            <Icon size={18} />
            {hasNewActivity && (
              <span
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"
                aria-hidden="true"
              />
            )}
          </span>
          <span className={compact ? "hidden sm:inline" : ""}>{label}</span>
        </NavLink>
      );
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-lg">
          <img src={logo} alt="ProConnect" className="h-9 w-9" />
          <span className="bg-gradient-to-r from-brand-indigo to-brand-purple bg-clip-text font-bold text-transparent">
            ProConnect
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="ml-auto hidden items-center gap-1 sm:flex">
          {renderLinks(true)}
        </nav>
        <div className="relative ml-auto sm:ml-3" ref={accountMenuRef}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full p-1.5 transition-colors hover:bg-surface-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
            onClick={() => setAccountMenuOpen((isOpen) => !isOpen)}
            aria-label="Open account menu"
            aria-haspopup="true"
            aria-expanded={accountMenuOpen}
            aria-controls="account-menu"
          >
            <span className="relative block">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt=""
                  className="h-9 w-9 rounded-full border border-border-subtle object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple text-sm font-semibold text-white ring-2 ring-white">
                  {initials}
                </span>
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <span className="hidden max-w-36 text-left sm:block">
              <span className="block truncate text-sm font-semibold leading-4 text-ink-primary">
                {user?.name || "Your account"}
              </span>
              <span className="mt-1 block truncate text-xs leading-3 text-ink-secondary">
                {user?.username ? `@${user.username}` : "ProConnect member"}
              </span>
            </span>
            <ChevronDown
              size={16}
              className={`hidden text-ink-secondary transition-transform sm:block ${accountMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {accountMenuOpen && (
            <div
              id="account-menu"
              className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border-subtle bg-white p-2 shadow-xl"
              aria-label="Account menu"
            >
              <div className="flex items-center gap-3 rounded-xl bg-surface-bg p-3">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple font-semibold text-white">
                    {initials}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink-primary">
                    {user?.name || "Your account"}
                  </span>
                  <span className="block truncate text-xs text-ink-secondary">
                    {user?.username ? `@${user.username}` : "ProConnect member"}
                  </span>
                </span>
              </div>
              {user?.username && (
                <Link
                  to={`/profile/${user.username}`}
                  onClick={() => setAccountMenuOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-bg"
                >
                  <UserRound size={17} className="text-brand-indigo" />
                  View profile
                </Link>
              )}
              <div className="my-1 border-t border-border-subtle" />
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="grid grid-cols-5 border-t border-border-subtle px-2 py-1 sm:hidden">
        {renderLinks()}
      </nav>
    </header>
  );
}
