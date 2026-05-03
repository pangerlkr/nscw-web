import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader } from "./ui";
import { useAuth } from "../AuthContext";

const STATUS_BADGE = {
  new: "badge-new",
  in_review: "badge-review",
  resolved: "badge-resolved",
  dismissed: "badge-dismissed",
};

const STATUS_LABEL = { new: "New", in_review: "In Review", resolved: "Resolved", dismissed: "Dismissed" };

export default function GrievancesInbox() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function load() {
    setLoading(true);
    try { setItems((await api.get("/grievances")).data); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/grievances/${id}?status=${status}`);
      toast.success("Status updated");
      load();
      setSelected((s) => s && s.id === id ? { ...s, status } : s);
    } catch (err) { toast.error(formatApiError(err)); }
  }
  async function remove(id) {
    if (!window.confirm("Permanently delete this grievance?")) return;
    try { await api.delete(`/grievances/${id}`); toast.success("Deleted"); setSelected(null); load(); }
    catch (err) { toast.error(formatApiError(err)); }
  }

  const filtered = filter === "all" ? items : items.filter((g) => g.status === filter);

  return (
    <div data-testid="grievances-inbox">
      <PageHeader eyebrow="Grievances" title="Grievances Inbox" description="Submissions from citizens via the public Grievance Portal." />

      <div className="flex flex-wrap gap-2 mb-6" data-testid="grievance-filters">
        {["all", "new", "in_review", "resolved", "dismissed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-label text-xs font-bold tracking-[0.15em] uppercase transition ${filter === f ? "bg-primary text-white" : "bg-white border border-outline-variant/40 text-on-surface-variant hover:border-primary"}`} data-testid={`filter-${f}`}>
            {f === "all" ? "All" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="cms-card !p-0 overflow-hidden">
        {loading ? <div className="p-8 text-on-surface-variant">Loading…</div> :
          filtered.length === 0 ? <div className="p-10 text-center text-on-surface-variant">No grievances in this view.</div> : (
          <table className="w-full">
            <thead><tr className="bg-surface-container text-left">
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Subject</th>
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">From</th>
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">District</th>
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Received</th>
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Status</th>
            </tr></thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-t border-outline-variant/30 hover:bg-surface-container-low cursor-pointer" onClick={() => setSelected(g)} data-testid={`grievance-row-${g.id}`}>
                  <td className="p-4 font-headline font-bold text-primary">{g.subject}</td>
                  <td className="p-4"><div className="font-body text-sm">{g.name}</div><div className="text-xs text-on-surface-variant opacity-70">{g.email}</div></td>
                  <td className="p-4 font-body text-sm">{g.district || "—"}</td>
                  <td className="p-4 font-body text-sm text-on-surface-variant">{g.created_at ? new Date(g.created_at).toLocaleString() : "—"}</td>
                  <td className="p-4"><span className={`badge ${STATUS_BADGE[g.status] || "badge-new"}`}>{STATUS_LABEL[g.status] || g.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" data-testid="grievance-modal">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4"><span className="material-symbols-outlined">close</span></button>
            <div className="flex items-center gap-3 mb-1">
              <span className={`badge ${STATUS_BADGE[selected.status] || "badge-new"}`}>{STATUS_LABEL[selected.status]}</span>
              <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">{selected.created_at ? new Date(selected.created_at).toLocaleString() : ""}</span>
            </div>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-6">{selected.subject}</h2>

            <dl className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div><dt className="field-label">Name</dt><dd className="font-body">{selected.name}</dd></div>
              <div><dt className="field-label">Email</dt><dd className="font-body break-all">{selected.email}</dd></div>
              <div><dt className="field-label">Phone</dt><dd className="font-body">{selected.phone || "—"}</dd></div>
              <div><dt className="field-label">District</dt><dd className="font-body">{selected.district || "—"}</dd></div>
            </dl>

            <div className="mb-8">
              <div className="field-label">Message</div>
              <div className="font-body text-on-surface whitespace-pre-wrap leading-relaxed p-4 bg-surface-container-low rounded-lg">{selected.message}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["new", "in_review", "resolved", "dismissed"].map((st) => (
                <button key={st} onClick={() => updateStatus(selected.id, st)} className={`btn-ghost ${selected.status === st ? "!bg-primary !text-white !border-primary" : ""}`} data-testid={`grievance-status-${st}`}>
                  Mark as {STATUS_LABEL[st]}
                </button>
              ))}
              {user?.role === "admin" && (
                <button onClick={() => remove(selected.id)} className="btn-danger ml-auto" data-testid="grievance-delete">Delete</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
