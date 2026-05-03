import { useState } from "react";
import toast from "react-hot-toast";
import { api, formatApiError } from "../api";

export default function Grievance() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", district: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/grievances", form);
      setDone(true);
      toast.success("Grievance submitted. Our team will respond soon.");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="pt-40 pb-24 px-6 max-w-3xl mx-auto text-center" data-testid="grievance-done">
        <span className="material-symbols-outlined text-secondary text-6xl mb-6 block">task_alt</span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary mb-4">Grievance Received</h1>
        <p className="font-body text-lg text-on-surface-variant max-w-xl mx-auto mb-10">Our team has received your submission. We treat every grievance with discretion and urgency.</p>
        <button onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", district: "", subject: "", message: "" }); }} className="btn-ghost">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="grievance-page">
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-error"></div>
          <span className="font-label text-sm uppercase tracking-widest text-error font-bold">Grievance Portal</span>
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-primary leading-tight tracking-tighter mb-6">
          Report an <span className="italic font-light">Issue</span>
        </h1>
        <p className="font-body text-lg text-on-surface-variant mb-12">All submissions are treated with strict confidentiality. A case officer will respond to your registered email within 72 hours.</p>

        <form onSubmit={submit} className="cms-card space-y-6" data-testid="grievance-form">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="field-label">Full Name *</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="field-input" data-testid="grievance-name" />
            </div>
            <div>
              <label className="field-label">Email *</label>
              <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className="field-input" data-testid="grievance-email" />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field-input" data-testid="grievance-phone" />
            </div>
            <div>
              <label className="field-label">District</label>
              <input value={form.district} onChange={(e) => update("district", e.target.value)} className="field-input" data-testid="grievance-district" />
            </div>
          </div>
          <div>
            <label className="field-label">Subject *</label>
            <input required value={form.subject} onChange={(e) => update("subject", e.target.value)} className="field-input" data-testid="grievance-subject" />
          </div>
          <div>
            <label className="field-label">Describe your grievance *</label>
            <textarea required value={form.message} onChange={(e) => update("message", e.target.value)} className="field-textarea" rows={6} data-testid="grievance-message" />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary" data-testid="grievance-submit">
              {submitting ? "Submitting…" : "Submit Grievance"}
            </button>
            <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant opacity-70">Your data is confidential</span>
          </div>
        </form>
      </section>
    </div>
  );
}
