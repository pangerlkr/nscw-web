import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input, Textarea } from "./ui";

const EMPTY = { title: "", year: new Date().getFullYear(), description: "", pdf_url: "", published: true };

export default function ReportsManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { const r = await api.get("/reports"); setItems(r.data); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    const payload = { ...editing };
    payload.year = Number(payload.year);
    delete payload._mode;
    try {
      if (editing._mode === "create") await api.post("/reports", payload);
      else await api.put(`/reports/${editing.id}`, payload);
      toast.success("Saved");
      setEditing(null); load();
    } catch (err) { toast.error(formatApiError(err)); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this report?")) return;
    try { await api.delete(`/reports/${id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(formatApiError(err)); }
  }

  return (
    <div data-testid="reports-manager">
      <PageHeader eyebrow="Reports" title="Annual Reports" description="Catalog and publish institutional annual reports."
        action={<button onClick={() => setEditing({ ...EMPTY, _mode: "create" })} className="btn-primary" data-testid="report-new-btn"><span className="material-symbols-outlined align-middle mr-1 text-base">add</span>Add Report</button>} />

      <div className="cms-card !p-0 overflow-hidden">
        {loading ? <div className="p-8 text-on-surface-variant">Loading…</div> :
         items.length === 0 ? <div className="p-10 text-center text-on-surface-variant">No reports yet.</div> : (
          <table className="w-full">
            <thead><tr className="bg-surface-container text-left">
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Year</th>
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Title</th>
              <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Status</th>
              <th></th>
            </tr></thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-t border-outline-variant/30" data-testid={`report-row-${r.id}`}>
                  <td className="p-4 font-headline font-black text-primary text-xl">{r.year}</td>
                  <td className="p-4"><div className="font-headline font-bold text-primary">{r.title}</div><div className="text-xs text-on-surface-variant opacity-70 mt-1 break-all">{r.pdf_url}</div></td>
                  <td className="p-4"><span className={`badge ${r.published ? "badge-resolved" : "badge-dismissed"}`}>{r.published ? "Published" : "Draft"}</span></td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => setEditing({ ...r, _mode: "edit" })} className="btn-ghost mr-2" data-testid={`report-edit-${r.id}`}>Edit</button>
                    <button onClick={() => remove(r.id)} className="btn-danger" data-testid={`report-delete-${r.id}`}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" data-testid="report-modal">
          <form onSubmit={save} className="bg-white rounded-xl max-w-2xl w-full p-8 relative">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-4 right-4"><span className="material-symbols-outlined">close</span></button>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-6">{editing._mode === "create" ? "Add Report" : "Edit Report"}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Title" col={2}><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} data-testid="report-field-title" /></Field>
              <Field label="Year"><Input type="number" required value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} data-testid="report-field-year" /></Field>
              <Field label="PDF URL"><Input required value={editing.pdf_url} onChange={(e) => setEditing({ ...editing, pdf_url: e.target.value })} placeholder="/NL-NSCW-Act.pdf or https://..." data-testid="report-field-pdf" /></Field>
              <Field label="Description" col={2}><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} data-testid="report-field-description" /></Field>
              <Field label="Published" col={2}>
                <label className="inline-flex items-center gap-3"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="w-5 h-5" data-testid="report-field-published"/><span>Visible to the public</span></label>
              </Field>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary" data-testid="report-save">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
