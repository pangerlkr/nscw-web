import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

export default function ChroniclePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(null);
    setError(false);
    api.get(`/chronicle/${slug}`).then((r) => setPost(r.data)).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="pt-40 pb-24 px-6 max-w-3xl mx-auto text-center" data-testid="chronicle-post-not-found">
        <h1 className="font-headline text-4xl font-extrabold text-primary mb-4">Chronicle not found</h1>
        <Link to="/updates" className="btn-ghost inline-block">Back to Updates</Link>
      </div>
    );
  }
  if (!post) return <div className="min-h-screen" />;

  return (
    <article className="pt-32 pb-24" data-testid="chronicle-post">
      <header className="relative h-[60vh] min-h-[420px] w-full">
        <img src={post.cover_image_url || "https://picsum.photos/seed/hero/1920/1080"} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4 text-white/80">
            <span className="font-label text-[10px] tracking-[0.25em] uppercase font-bold text-secondary-fixed">{post.category}</span>
            {post.published_at && (
              <span className="font-label text-[10px] opacity-70">· {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            )}
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl text-shadow-editorial">{post.title}</h1>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 md:px-0 mt-16">
        {post.excerpt && (
          <p className="font-headline text-xl md:text-2xl text-primary italic leading-relaxed border-l-4 border-secondary pl-6 mb-12">
            {post.excerpt}
          </p>
        )}
        <div className="font-body text-lg text-on-surface leading-relaxed whitespace-pre-wrap">{post.body}</div>
        <div className="mt-16 pt-10 border-t border-outline-variant/30">
          <Link to="/updates" className="inline-flex items-center gap-2 font-label text-xs font-bold tracking-[0.25em] uppercase text-secondary hover:text-primary">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            All Chronicles
          </Link>
        </div>
      </section>
    </article>
  );
}
