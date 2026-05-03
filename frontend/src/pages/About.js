import { useEffect, useState } from "react";
import { api } from "../api";

export default function About() {
  const [c, setC] = useState(null);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    api.get("/content/about").then((r) => setC(r.data)).catch(() => setC({}));
    api.get("/team").then((r) => setTeam(r.data)).catch(() => setTeam([]));
  }, []);

  if (!c) return <div className="min-h-screen" />;

  return (
    <div data-testid="about-page" className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <section className="max-w-5xl mx-auto mb-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-secondary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold">{c.eyebrow}</span>
        </div>
        <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary leading-tight tracking-tighter mb-10">
          {c.heading}
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-3xl">{c.body}</p>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-24">
        <div className="cms-card relative overflow-hidden">
          <div className="absolute top-6 right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-secondary font-bold">Vision</span>
          <p className="font-headline text-2xl md:text-3xl text-primary mt-4 leading-snug italic">{c.vision}</p>
        </div>
        <div className="cms-card relative overflow-hidden">
          <div className="absolute top-6 right-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-secondary font-bold">Mission</span>
          <p className="font-headline text-2xl md:text-3xl text-primary mt-4 leading-snug italic">{c.mission}</p>
        </div>
      </section>

      {team.length > 0 && (
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-[2px] w-12 bg-tertiary"></div>
            <span className="font-label text-sm uppercase tracking-widest text-tertiary font-bold">Leadership</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-16">Office Bearers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {team.map((m) => (
              <div key={m.id} className="cms-card text-center" data-testid={`team-card-${m.id}`}>
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-surface-container mb-6 border-4 border-surface-container-low shadow-lg">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/images/ncw.webp"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/40">
                      <span className="material-symbols-outlined text-5xl">person</span>
                    </div>
                  )}
                </div>
                <div className="font-headline font-bold text-primary text-lg mb-1">{m.name}</div>
                <div className="font-label text-[11px] tracking-[0.2em] uppercase text-secondary mb-4">{m.title}</div>
                <p className="font-body text-sm text-on-surface-variant opacity-80 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
