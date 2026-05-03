import { useEffect, useState } from "react";
import { api } from "../api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reports?published_only=true")
      .then((r) => setReports(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="reports-page">
      <section className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-tertiary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-tertiary font-bold">Institutional Archives</span>
        </div>
        <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary leading-tight tracking-tighter mb-8">
          Annual <span className="italic font-light">Chronicles</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-3xl">A meticulous chronicle of institutional activity, interventions, and the state of gender equity across the year.</p>
      </section>

      <section className="max-w-5xl mx-auto">
        {loading ? (
          <div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div>
        ) : reports.length === 0 ? (
          <div className="cms-card text-center text-on-surface-variant">No reports published yet.</div>
        ) : (
          <div className="space-y-6">
            {reports.map((r) => (
              <div key={r.id} className="cms-card flex flex-col md:flex-row gap-8 items-start" data-testid={`report-row-${r.id}`}>
                <div className="md:w-32 flex-shrink-0">
                  <div className="font-headline font-black text-5xl text-primary">{r.year}</div>
                  <div className="font-label text-[10px] tracking-[0.25em] uppercase text-tertiary font-bold mt-1">Annual Record</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline text-2xl font-bold text-primary mb-3">{r.title}</h3>
                  {r.description && <p className="font-body text-on-surface-variant leading-relaxed mb-6 opacity-85">{r.description}</p>}
                  <a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">download</span>
                    Download Report
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
