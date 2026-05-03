import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

const CARDS = [
  { key: "chronicle_posts", label: "Chronicle Posts", icon: "article", link: "/admin/chronicle", color: "bg-primary" },
  { key: "reports", label: "Annual Reports", icon: "stacked_bar_chart", link: "/admin/reports", color: "bg-secondary" },
  { key: "directory_entries", label: "OSC Directory", icon: "location_city", link: "/admin/directory", color: "bg-tertiary" },
  { key: "team_members", label: "Team Members", icon: "groups", link: "/admin/team", color: "bg-primary-container" },
  { key: "grievances_new", label: "New Grievances", icon: "inbox", link: "/admin/grievances", color: "bg-error" },
  { key: "users", label: "Team Accounts", icon: "manage_accounts", link: "/admin/users", color: "bg-purple-700" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-12">
        <div className="font-label text-xs tracking-[0.3em] uppercase text-secondary font-bold mb-2">Overview</div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tighter mb-4">
          Welcome back, <span className="italic font-light">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl">The Commission's content at a glance. Curate, publish, and steward the institutional narrative from this dashboard.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {CARDS.filter((c) => c.key !== "users" || user?.role === "admin").map((card) => (
          <Link key={card.key} to={card.link} className="cms-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group" data-testid={`stat-card-${card.key}`}>
            <div className={`w-12 h-12 rounded-lg ${card.color} text-white flex items-center justify-center mb-6`}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <div className="font-label text-[11px] tracking-[0.2em] uppercase text-on-surface-variant font-bold mb-1">{card.label}</div>
            <div className="font-headline text-4xl font-black text-primary mb-4">{loading ? "—" : (stats[card.key] ?? 0)}</div>
            <div className="inline-flex items-center gap-1 font-label text-[11px] tracking-[0.2em] uppercase text-secondary font-bold group-hover:text-primary">
              Manage
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="cms-card">
        <h2 className="font-headline text-xl font-bold text-primary mb-6">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/homepage" className="btn-ghost w-full py-4 text-center" data-testid="quick-edit-homepage">Edit Homepage</Link>
          <Link to="/admin/chronicle" className="btn-ghost w-full py-4 text-center" data-testid="quick-new-post">New Chronicle Post</Link>
          <Link to="/admin/grievances" className="btn-ghost w-full py-4 text-center" data-testid="quick-view-grievances">View Grievances</Link>
          <Link to="/admin/reports" className="btn-ghost w-full py-4 text-center" data-testid="quick-new-report">Add Report</Link>
        </div>
      </section>
    </div>
  );
}
