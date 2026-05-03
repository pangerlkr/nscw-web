import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input, Textarea } from "./ui";

export default function AboutEditor() {
  const [c, setC] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/content/about").then((r) => setC(r.data)); }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/content/about", c);
      toast.success("About page saved");
    } catch (err) { toast.error(formatApiError(err)); }
    finally { setSaving(false); }
  }

  if (!c) return <div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div>;

  return (
    <div data-testid="about-editor">
      <PageHeader
        eyebrow="About"
        title="Edit About Page"
        description="Update the Commission's public-facing mission narrative."
      />
      <form onSubmit={save} className="cms-card space-y-5">
        <Field label="Eyebrow"><Input value={c.eyebrow} onChange={(e) => setC({ ...c, eyebrow: e.target.value })} data-testid="about-eyebrow" /></Field>
        <Field label="Heading"><Input value={c.heading} onChange={(e) => setC({ ...c, heading: e.target.value })} data-testid="about-heading" /></Field>
        <Field label="Body"><Textarea rows={6} value={c.body} onChange={(e) => setC({ ...c, body: e.target.value })} data-testid="about-body" /></Field>
        <Field label="Vision"><Textarea rows={3} value={c.vision} onChange={(e) => setC({ ...c, vision: e.target.value })} data-testid="about-vision" /></Field>
        <Field label="Mission"><Textarea rows={3} value={c.mission} onChange={(e) => setC({ ...c, mission: e.target.value })} data-testid="about-mission" /></Field>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary" data-testid="about-save">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}
