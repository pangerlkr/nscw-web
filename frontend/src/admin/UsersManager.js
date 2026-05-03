import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input } from "./ui";
import { useAuth } from "../AuthContext";

const EMPTY = { email: "", password: "", name: "", role: "editor" };

export default function UsersManager() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const { user: me } = useAuth();

  async function load() { setItems((await api.get("/users")).data); }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    const payload = { ...editing };
    const mode = editing._mode;
    delete payload._mode;
    try {
      if (mode === "create") {
        await api.post("/users", payload);
        toast.success("User created");
      } else {
        const update = { name: payload.name, role: payload.role };
        if (payload.password) update.password = payload.password;
        await api.patch(`/users/${payload.id}`, update);
        toast.success("User updated");
      }
      setEditing(null); load();
    } catch (err) { toast.error(formatApiError(err)); }
  }

  async function remove(u) {
    if (u.id === me.id) return toast.error("Cannot delete your own account");
    if (!window.confirm(`Delete user ${u.email}?`)) return;
    try { await api.delete(`/users/${u.id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(formatApiError(err)); }
  }

  return (
    <div data-testid="users-manager">
      <PageHeader eyebrow="Access" title="Team Accounts" description="Manage admin and editor access to the CMS dashboard."
        action={<button onClick={() => setEditing({ ...EMPTY, _mode: "create" })} className="btn-primary" data-testid="user-new-btn"><span className="material-symbols-outlined align-middle mr-1 text-base">add</span>New User</button>} />

      <div className="cms-card !p-0 overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-surface-container text-left">
            <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Name</th>
            <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Email</th>
            <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Role</th>
            <th></th>
          </tr></thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t border-outline-variant/30" data-testid={`user-row-${u.id}`}>
                <td className="p-4 font-headline font-bold text-primary">{u.name}{u.id === me.id && <span className="ml-2 font-label text-[10px] uppercase tracking-[0.2em] text-secondary">you</span>}</td>
                <td className="p-4 font-body text-sm">{u.email}</td>
                <td className="p-4"><span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-editor"}`}>{u.role}</span></td>
                <td className="p-4 text-right whitespace-nowrap">
                  <button onClick={() => setEditing({ ...u, password: "", _mode: "edit" })} className="btn-ghost mr-2" data-testid={`user-edit-${u.id}`}>Edit</button>
                  <button onClick={() => remove(u)} className="btn-danger" disabled={u.id === me.id} data-testid={`user-delete-${u.id}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" data-testid="user-modal">
          <form onSubmit={save} className="bg-white rounded-xl max-w-md w-full p-8 relative">
            <button type="button" onClick={() => setEditing(null)} className="absolute top-4 right-4"><span className="material-symbols-outlined">close</span></button>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-6">{editing._mode === "create" ? "New Team Account" : "Edit User"}</h2>
            <div className="space-y-5">
              <Field label="Name"><Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} data-testid="user-field-name" /></Field>
              <Field label="Email"><Input type="email" required disabled={editing._mode === "edit"} value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} data-testid="user-field-email" /></Field>
              <Field label={editing._mode === "create" ? "Password" : "New Password (leave blank to keep current)"}>
                <Input type="password" required={editing._mode === "create"} value={editing.password || ""} onChange={(e) => setEditing({ ...editing, password: e.target.value })} minLength={6} data-testid="user-field-password" />
              </Field>
              <Field label="Role">
                <select className="field-select" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} data-testid="user-field-role">
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary" data-testid="user-save">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
