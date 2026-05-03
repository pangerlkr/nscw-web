import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input, Textarea } from "./ui";

const EMPTY = { title: "", slug: "", excerpt: "", body: "", cover_image_url: "", category: "Update", published: true };

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function ChronicleManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // post being edited (or null)

  async function load() {
    setLoading(true);
    try {
      const r = await api.get("/chronicle");
      setItems(r.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openNew() { setEditing({ ...EMPTY, _mode: "create" }); }
  function openEdit(p) { setEditing({ ...p, _mode: "edit" }); }
  function close() { setEditing(null); }

  async function save(e) {
    e.preventDefault();
    const payload = { ...editing };
    if (!payload.slug) payload.slug = slugify(payload.title);
    delete payload._mode;
    try {
      if (editing._mode === "create") {
        await api.post("/chronicle", payload);
        toast.success("Post created");
      } else {
        await api.put(`/chronicle/${editing.id}`, payload);
        toast.success("Post updated");
      }
      close();
      load();
    } catch (err) { toast.error(formatApiError(err)); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.delete(`/chronicle/${id}`);
      toast.success("Post deleted");
      load();
    } catch (err) { toast.error(formatApiError(err)); }
  }

  return (
    <div data-testid="chronicle-manager">
      <PageHeader
        eyebrow="Chronicle"
        title="Chronicle Posts"
        description="Author and publish news, initiatives, and institutional updates."
        action={<button onClick={openNew} className="btn-primary" data-testid="chronicle-new-btn"><span className="material-symbols-outlined align-middle mr-1 text-base">add</span>New Post</button>}
      />

      <div className="cms-card overflow-hidden !p-0">
        {loading ? (
          <div className="p-8 text-on-surface-variant font-label text-xs tracking-[0.3em] uppercase">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-on-surface-variant">No chronicle posts yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container text-left">
                <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">Title</th>
                <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">Category</th>
                <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">Status</th>
                <th className="p-4 font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-outline-variant/30" data-testid={`chronicle-row-${p.id}`}>
                  <td className="p-4">
                    <div className="font-headline font-bold text-primary">{p.title}</div>
                    <div className="font-body text-xs text-on-surface-variant opacity-70 mt-1">/{p.slug}</div>
                  </td>
                  <td className="p-4 font-label text-xs uppercase tracking-[0.15em] text-tertiary font-bold">{p.category}</td>
                  <td className="p-4">
                    <span className={`badge ${p.published ? "badge-resolved" : "badge-dismissed"}`}>{p.published ? "Published" : "Draft"}</span>
                  </td>
                  <td className="p-4 font-body text-sm text-on-surface-variant">{p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="btn-ghost mr-2" data-testid={`chronicle-edit-${p.id}`}>Edit</button>
                    <button onClick={() => remove(p.id)} className="btn-danger" data-testid={`chronicle-delete-${p.id}`}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" data-testid="chronicle-modal">
          <form onSubmit={save} className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button type="button" onClick={close} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary" aria-label="Close" data-testid="chronicle-modal-close">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline text-2xl font-extrabold text-primary mb-6">{editing._mode === "create" ? "New Chronicle Post" : "Edit Post"}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Title" col={2}>
                <Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing._mode === "create" && !editing.slug ? slugify(e.target.value) : editing.slug })} data-testid="chronicle-field-title" />
              </Field>
              <Field label="Slug"><Input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} data-testid="chronicle-field-slug" /></Field>
              <Field label="Category"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} data-testid="chronicle-field-category" /></Field>
              <Field label="Cover Image URL" col={2}><Input value={editing.cover_image_url} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} data-testid="chronicle-field-cover" /></Field>
              <Field label="Excerpt" col={2}><Textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} data-testid="chronicle-field-excerpt" /></Field>
              <Field label="Body" col={2}><Textarea rows={10} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} data-testid="chronicle-field-body" /></Field>
              <Field label="Published" col={2}>
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="w-5 h-5 text-primary" data-testid="chronicle-field-published" />
                  <span className="font-body text-sm text-on-surface">Visible to the public</span>
                </label>
              </Field>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={close} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary" data-testid="chronicle-save">Save Post</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
