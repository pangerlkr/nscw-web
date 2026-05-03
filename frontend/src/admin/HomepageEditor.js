import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";
import { PageHeader, Field, Input, Textarea } from "./ui";

const SECTIONS = [
  {
    key: "hero", title: "Hero", fields: [
      ["hero_eyebrow", "Eyebrow"],
      ["hero_heading_line_1", "Heading Line 1"],
      ["hero_heading_line_2", "Heading Line 2 (accent)"],
      ["hero_subheading", "Subheading", "textarea"],
      ["hero_image_url", "Background Image URL"],
      ["hero_cta_primary", "Primary CTA Label"],
      ["hero_cta_primary_link", "Primary CTA Link"],
      ["hero_cta_secondary", "Secondary CTA Label"],
      ["hero_cta_secondary_link", "Secondary CTA Link"],
    ],
  },
  {
    key: "mandate", title: "Mandate Section", fields: [
      ["mandate_eyebrow", "Eyebrow"],
      ["mandate_heading", "Heading"],
      ["mandate_body_1", "Body Paragraph 1", "textarea"],
      ["mandate_body_2", "Body Paragraph 2", "textarea"],
      ["mandate_quote", "Quote", "textarea"],
      ["mandate_quote_author", "Quote Author"],
    ],
  },
  {
    key: "pillars", title: "Operational Pillars", fields: [
      ["pillar_1_title", "Pillar 1 Title"],
      ["pillar_1_body", "Pillar 1 Body", "textarea"],
      ["pillar_1_icon", "Pillar 1 Icon (Material Symbol name)"],
      ["pillar_1_link", "Pillar 1 Link"],
      ["pillar_2_title", "Pillar 2 Title"],
      ["pillar_2_body", "Pillar 2 Body", "textarea"],
      ["pillar_2_icon", "Pillar 2 Icon"],
      ["pillar_2_link", "Pillar 2 Link"],
      ["pillar_3_title", "Pillar 3 Title"],
      ["pillar_3_body", "Pillar 3 Body", "textarea"],
      ["pillar_3_icon", "Pillar 3 Icon"],
      ["pillar_3_link", "Pillar 3 Link"],
    ],
  },
  {
    key: "cta", title: "Engagement CTA", fields: [
      ["cta_eyebrow", "Eyebrow"],
      ["cta_heading", "Heading"],
      ["cta_body", "Body", "textarea"],
      ["cta_button_text", "Button Text"],
      ["cta_button_link", "Button Link"],
    ],
  },
];

export default function HomepageEditor() {
  const [c, setC] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/content/homepage").then((r) => setC(r.data)); }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/content/homepage", c);
      toast.success("Homepage content saved");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  }

  if (!c) return <div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div>;

  return (
    <div data-testid="homepage-editor">
      <PageHeader
        eyebrow="Homepage"
        title="Edit Homepage"
        description="Curate the hero, mandate narrative, operational pillars, and call-to-action of the home page."
        action={<button form="homepage-form" disabled={saving} className="btn-primary" data-testid="homepage-save-top">{saving ? "Saving…" : "Save changes"}</button>}
      />

      <form id="homepage-form" onSubmit={save} className="space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.key} className="cms-card">
            <h2 className="font-headline text-lg font-bold text-primary mb-6 flex items-center gap-3">
              <span className="h-[2px] w-6 bg-secondary block" />
              {s.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {s.fields.map(([key, label, type]) => {
                const isFull = type === "textarea";
                return (
                  <Field key={key} label={label} col={isFull ? 2 : 1}>
                    {type === "textarea" ? (
                      <Textarea value={c[key] ?? ""} onChange={(e) => setC({ ...c, [key]: e.target.value })} data-testid={`hp-${key}`} />
                    ) : (
                      <Input value={c[key] ?? ""} onChange={(e) => setC({ ...c, [key]: e.target.value })} data-testid={`hp-${key}`} />
                    )}
                  </Field>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary" data-testid="homepage-save">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}
