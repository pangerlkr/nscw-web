import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Chronicle() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/chronicle?published_only=true")
      .then((r) => setPosts(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="chronicle-page">
      <section className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-secondary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold">The Chronicle</span>
        </div>
        <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary leading-tight tracking-tighter mb-8">
          Latest <span className="italic font-light">Updates</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-3xl">Documenting progress, partnerships, and the ongoing narrative of women's advancement across Nagaland.</p>
      </section>

      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="cms-card text-center text-on-surface-variant">No published updates yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {posts.map((p) => (
              <Link key={p.id} to={`/updates/${p.slug}`} className="group cms-card overflow-hidden !p-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" data-testid={`chronicle-card-${p.slug}`}>
                <div className="aspect-[16/10] overflow-hidden bg-surface-container">
                  <img src={p.cover_image_url || "https://picsum.photos/seed/post/800/500"} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.currentTarget.src='https://picsum.photos/seed/fallback/800/500'}} />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-label text-[10px] tracking-[0.25em] uppercase text-tertiary font-bold">{p.category}</span>
                    {p.published_at && (
                      <span className="font-label text-[10px] text-on-surface-variant opacity-60">
                        · {new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <h2 className="font-headline text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors leading-snug">{p.title}</h2>
                  <p className="font-body text-on-surface-variant opacity-80 leading-relaxed text-sm">{p.excerpt}</p>
                  <div className="mt-6 inline-flex items-center gap-2 font-label text-xs font-bold tracking-[0.2em] uppercase text-secondary">
                    Read Chronicle
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
