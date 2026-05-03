import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input } from "./ui";

const EMPTY = { district: "", center_name: "", address: "", phone: "", email: "", contact_person: "" };

export default function DirectoryManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() { setItems((await api.get("/directory")).data); }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    const payload = { ...editing };
    delete payload._mode;
    try {
      if (editing._mode === "create") await api.post("/directory", payload);
      else await api.put(`/directory/${editing.id}`, payload);
      toast.success("Saved"); setEditing(null); load();
    } catch (err) { toast.error(formatApiError(err)); }
  }
  async function remove(id) {
    if (!window.confirm("Delete this entry?")) return;
    try { await api.delete(`/directory/${id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(formatApiError(err)); }
  }

  return (
    <div data-testid="directory-manager">
      <PageHeader eyebrow="Directory" title="One Stop Centre Directory" description="Manage district-level support centres shown on the Support page."
        action={<button onClick={() => setEditing({ ...EMPTY, _mode: "create" })} className="btn-primary" data-testid="dir-new-btn"><span className="material-symbols-outlined align-middle mr-1 text-base">add</span>New Entry</button>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((d) => (
          <div key={d.id} className="cms-card" data-testid={`dir-row-${d.id}`}>
            <div className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary font-bold mb-2">{d.district}</div>
            <h3 className="font-headline text-lg font-bold text-primary mb-3">{d.center_name}</h3>
            <div className="font-body text-xs text-on-surface-variant opacity-80 space-y-1 leading-relaxed">
              {d.address && <div>{d.address}</div>}
              {d.phone && <div>{d.phone}</div>}
              {d.email && <div className="break-all">{d.email}</div>}
              {d.contact_person && <div>{d.contact_person}</div>}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditing({ ...d, _mode: "edit" })} className="btn-ghost flex-1" data-testid={`dir-edit-${d.id}`}>Edit</button>
              <button onClick={() => remove(d.id)} className="btn-danger" data-testid={`dir-delete-${d.id}`}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" data-testid="dir-modal">
          <form onSubmit={save} className="bg-white rounded-xl max-w-2xl w-full p-8 relative">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-4 right-4"><span className="material-symbols-outlined">close</span></button>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-6">{editing._mode === "create" ? "Add Directory Entry" : "Edit Entry"}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="District"><Input required value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} data-testid="dir-field-district" /></Field>
              <Field label="Centre Name"><Input required value={editing.center_name} onChange={(e) => setEditing({ ...editing, center_name: e.target.value })} data-testid="dir-field-name" /></Field>
              <Field label="Address" col={2}><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} data-testid="dir-field-address" /></Field>
              <Field label="Phone"><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} data-testid="dir-field-phone" /></Field>
              <Field label="Email"><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} data-testid="dir-field-email" /></Field>
              <Field label="Contact Person" col={2}><Input value={editing.contact_person} onChange={(e) => setEditing({ ...editing, contact_person: e.target.value })} data-testid="dir-field-person" /></Field>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary" data-testid="dir-save">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
