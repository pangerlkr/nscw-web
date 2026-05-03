import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ITEMS = [
  { to: "/admin", label: "Overview", icon: "dashboard", end: true },
  { to: "/admin/homepage", label: "Homepage", icon: "home" },
  { to: "/admin/about", label: "About Page", icon: "info" },
  { to: "/admin/chronicle", label: "Chronicle Posts", icon: "article" },
  { to: "/admin/reports", label: "Annual Reports", icon: "stacked_bar_chart" },
  { to: "/admin/directory", label: "OSC Directory", icon: "location_city" },
  { to: "/admin/team", label: "Team Members", icon: "groups" },
  { to: "/admin/grievances", label: "Grievances Inbox", icon: "inbox" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      {/* Sidebar */}
      <aside className="w-72 bg-purple-950 text-white flex flex-col fixed h-screen overflow-y-auto" data-testid="admin-sidebar">
        <div className="px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="/images/ncw.webp" alt="NSCW" className="h-12 w-auto" />
            <div>
              <div className="font-headline font-black text-white text-lg tracking-widest uppercase leading-none">NSCW</div>
              <div className="text-[10px] font-label tracking-[0.2em] uppercase text-purple-200/60 mt-1">CMS Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`} data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`} data-testid="sidebar-link-users">
              <span className="material-symbols-outlined">manage_accounts</span>
              Users
            </NavLink>
          )}
        </nav>

        <div className="px-4 py-6 border-t border-white/5">
          <div className="px-2 py-3 mb-4">
            <div className="font-label text-[10px] tracking-[0.25em] uppercase text-purple-200/60 mb-1">Signed in as</div>
            <div className="font-headline font-bold text-sm text-white truncate">{user?.name}</div>
            <div className="text-xs text-purple-200/70 truncate">{user?.email}</div>
            <span className={`badge mt-2 inline-block ${user?.role === "admin" ? "badge-admin" : "badge-editor"}`}>{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-label text-sm font-bold tracking-wider uppercase transition" data-testid="admin-logout">
            <span className="material-symbols-outlined text-base">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-72 p-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
