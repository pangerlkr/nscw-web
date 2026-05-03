import { useEffect, useState } from "react";
import { api } from "../api";

export default function Support() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/directory").then((r) => setEntries(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="support-page">
      <section className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-secondary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold">District Directory</span>
        </div>
        <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary leading-tight tracking-tighter mb-8">
          One Stop <span className="italic font-light">Centres</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-3xl">Immediate support is never far. Our network of One Stop Centres (OSCs) operates across the districts of Nagaland.</p>
      </section>

      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((d) => (
              <div key={d.id} className="cms-card" data-testid={`directory-card-${d.id}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <span className="font-label text-xs tracking-[0.2em] uppercase text-secondary font-bold">{d.district}</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-primary mb-4 leading-snug">{d.center_name}</h3>
                <div className="space-y-3 font-body text-sm text-on-surface-variant">
                  {d.address && <div className="flex items-start gap-2"><span className="material-symbols-outlined text-base text-tertiary mt-0.5">home_pin</span><span>{d.address}</span></div>}
                  {d.phone && <div className="flex items-start gap-2"><span className="material-symbols-outlined text-base text-tertiary mt-0.5">call</span><a href={`tel:${d.phone}`} className="hover:text-primary">{d.phone}</a></div>}
                  {d.email && <div className="flex items-start gap-2"><span className="material-symbols-outlined text-base text-tertiary mt-0.5">mail</span><a href={`mailto:${d.email}`} className="hover:text-primary break-all">{d.email}</a></div>}
                  {d.contact_person && <div className="flex items-start gap-2"><span className="material-symbols-outlined text-base text-tertiary mt-0.5">person</span><span>{d.contact_person}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
