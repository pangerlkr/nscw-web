import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input, Textarea } from "./ui";

const EMPTY = { name: "", title: "", bio: "", photo_url: "", order: 0 };

export default function TeamManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() { setItems((await api.get("/team")).data); }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    const payload = { ...editing };
    payload.order = Number(payload.order) || 0;
    delete payload._mode;
    try {
      if (editing._mode === "create") await api.post("/team", payload);
      else await api.put(`/team/${editing.id}`, payload);
      toast.success("Saved"); setEditing(null); load();
    } catch (err) { toast.error(formatApiError(err)); }
  }
  async function remove(id) {
    if (!window.confirm("Remove this team member?")) return;
    try { await api.delete(`/team/${id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(formatApiError(err)); }
  }

  return (
    <div data-testid="team-manager">
      <PageHeader eyebrow="Team" title="Team Members" description="Curate the Commission's public-facing team on the About page."
        action={<button onClick={() => setEditing({ ...EMPTY, _mode: "create" })} className="btn-primary" data-testid="team-new-btn"><span className="material-symbols-outlined align-middle mr-1 text-base">add</span>Add Member</button>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((m) => (
          <div key={m.id} className="cms-card" data-testid={`team-row-${m.id}`}>
            <div className="flex gap-4 items-start mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.src="/images/ncw.webp"}} /> : <div className="w-full h-full flex items-center justify-center text-primary/40"><span className="material-symbols-outlined text-3xl">person</span></div>}
              </div>
              <div className="flex-1">
                <div className="font-headline font-bold text-primary">{m.name}</div>
                <div className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary font-bold mt-1">{m.title}</div>
                <div className="font-label text-[10px] text-on-surface-variant opacity-70 mt-1">Order: {m.order}</div>
              </div>
            </div>
            <p className="font-body text-xs text-on-surface-variant opacity-80 mb-4 line-clamp-3">{m.bio}</p>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...m, _mode: "edit" })} className="btn-ghost flex-1" data-testid={`team-edit-${m.id}`}>Edit</button>
              <button onClick={() => remove(m.id)} className="btn-danger" data-testid={`team-delete-${m.id}`}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" data-testid="team-modal">
          <form onSubmit={save} className="bg-white rounded-xl max-w-2xl w-full p-8 relative">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-4 right-4"><span className="material-symbols-outlined">close</span></button>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-6">{editing._mode === "create" ? "Add Team Member" : "Edit Member"}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Name"><Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} data-testid="team-field-name" /></Field>
              <Field label="Title"><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} data-testid="team-field-title" /></Field>
              <Field label="Photo URL" col={2}><Input value={editing.photo_url} onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })} placeholder="/images/name.jpg or https://..." data-testid="team-field-photo" /></Field>
              <Field label="Bio" col={2}><Textarea rows={4} value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} data-testid="team-field-bio" /></Field>
              <Field label="Display Order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: e.target.value })} data-testid="team-field-order" /></Field>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary" data-testid="team-save">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
