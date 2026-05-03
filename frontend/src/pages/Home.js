import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [c, setC] = useState(null);

  useEffect(() => {
    api.get("/content/homepage").then((r) => setC(r.data)).catch(() => setC({}));
  }, []);

  if (!c) return <div className="min-h-screen" />;

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="relative h-[100dvh] w-full flex items-center md:items-end justify-center md:justify-start px-6 md:px-12 lg:px-24 pt-32 md:pt-48 pb-24">
        <div className="absolute inset-0 z-0">
          <img alt="Empowering Women Nagaland" className="w-full h-full object-cover" src={c.hero_image_url || "https://picsum.photos/seed/nagaland-hero/1920/1080"} />
          <div className="absolute inset-0 asymmetric-gradient"></div>
        </div>
        <div className="relative z-10 max-w-4xl mt-16 md:mt-32">
          <div className="mb-6 inline-block">
            <span className="font-label text-secondary-fixed text-sm font-bold tracking-widest uppercase py-1 border-b-2 border-secondary-fixed">
              {c.hero_eyebrow}
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight mb-8 text-shadow-editorial" data-testid="home-hero-heading">
            {c.hero_heading_line_1}<br />
            <span className="text-secondary-fixed">{c.hero_heading_line_2}</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed font-light">{c.hero_subheading}</p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link
              to={c.hero_cta_primary_link || "/about"}
              className="bg-primary-container text-on-primary-container hover:bg-secondary hover:text-white px-10 py-5 rounded-lg text-lg font-bold transition-all duration-300 flex items-center gap-3 group"
              data-testid="hero-cta-primary"
            >
              {c.hero_cta_primary}
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </Link>
            <Link
              to={c.hero_cta_secondary_link || "/reports"}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-lg text-lg font-bold hover:bg-white/20 transition-all duration-300"
              data-testid="hero-cta-secondary"
            >
              {c.hero_cta_secondary}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-label text-[10px] text-white/60 uppercase tracking-[0.3em]">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </section>

      {/* Mandate */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-surface max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-secondary"></div>
              <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold">{c.mandate_eyebrow}</span>
            </div>
            <h2 className="font-headline text-4xl md:text-6xl font-extrabold text-primary leading-tight mb-12 tracking-tighter">
              {c.mandate_heading}
            </h2>
            <div className="space-y-8 font-body text-lg text-on-surface-variant leading-relaxed opacity-80">
              <p>{c.mandate_body_1}</p>
              <p>{c.mandate_body_2}</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
            <div className="relative bg-white p-12 rounded-2xl border border-outline-variant/20 shadow-2xl">
              <blockquote className="font-headline text-2xl font-light italic text-primary leading-relaxed mb-8">
                "{c.mandate_quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">edit_square</span>
                </div>
                <div>
                  <div className="font-headline font-bold text-primary">{c.mandate_quote_author}</div>
                  <div className="font-label text-[10px] tracking-widest uppercase text-secondary">NSCW Nagaland</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-purple-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-24">
          <h3 className="font-headline text-3xl md:text-5xl font-bold tracking-tight mb-6">Our Operational Ecosystem</h3>
          <p className="text-white/60 font-body text-lg max-w-2xl mx-auto italic">Strategic infrastructure built to respond to the needs of the 16 districts of Nagaland.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-10 border border-white/5 bg-white/5 backdrop-blur-xl rounded-2xl hover:bg-white/10 transition-all duration-300">
              <span className="material-symbols-outlined text-4xl text-secondary mb-6 block">{c[`pillar_${n}_icon`]}</span>
              <h4 className="font-headline text-2xl font-bold mb-4">{c[`pillar_${n}_title`]}</h4>
              <p className="text-white/60 font-body text-sm leading-relaxed mb-8">{c[`pillar_${n}_body`]}</p>
              <Link to={c[`pillar_${n}_link`] || "/"} className="text-xs font-bold tracking-[0.2em] uppercase text-secondary border-b border-secondary/30 pb-1">
                Read More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto bg-surface-container-low p-12 md:p-24 rounded-3xl text-center border border-outline-variant/10">
          <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold mb-6 block">{c.cta_eyebrow}</span>
          <h2 className="font-headline text-4xl md:text-6xl font-extrabold text-primary tracking-tighter mb-8 italic">{c.cta_heading}</h2>
          <p className="font-body text-lg text-on-surface-variant mb-12 opacity-80 leading-relaxed max-w-xl mx-auto">{c.cta_body}</p>
          <Link
            to={c.cta_button_link || "/grievance"}
            className="bg-primary hover:bg-primary-container text-white px-12 py-6 rounded-xl text-xl font-bold transition-all shadow-2xl shadow-primary/20 inline-block"
            data-testid="cta-button"
          >
            {c.cta_button_text}
          </Link>
        </div>
      </section>
    </div>
  );
}
