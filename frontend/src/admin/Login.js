import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext";
import { formatApiError } from "../api";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface"><div className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">Loading…</div></div>;
  }
  if (user) return <Navigate to={location.state?.from || "/admin"} replace />;

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg = formatApiError(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-purple-950 flex" data-testid="admin-login-page">
      {/* Left: branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-purple-900 text-white flex-col p-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-tertiary/10 blur-3xl" />
        <div className="flex items-center gap-4 relative z-10">
          <img src="/images/ncw.webp" alt="NSCW" className="h-14 w-auto" />
          <div>
            <div className="font-headline font-black text-2xl tracking-widest uppercase">NSCW</div>
            <div className="font-label text-xs tracking-[0.25em] uppercase text-white/60 mt-1">Nagaland</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center relative z-10 max-w-lg">
          <div className="h-[2px] w-16 bg-secondary-fixed mb-8" />
          <h1 className="font-headline text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight mb-8">
            Content<br />
            <span className="italic font-light text-secondary-fixed">Stewardship</span>
          </h1>
          <p className="font-body text-lg text-white/70 leading-relaxed">A curated workspace for the Commission's team to author, chronicle, and publish the work of empowering women across Nagaland.</p>
        </div>
        <div className="relative z-10 font-label text-[10px] tracking-[0.3em] uppercase text-white/40">© 2026 NSCW Nagaland</div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-surface">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 font-label text-[11px] tracking-[0.25em] uppercase text-on-surface-variant hover:text-primary mb-12" data-testid="login-back-home">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to site
          </Link>
          <div className="mb-10">
            <div className="font-label text-xs tracking-[0.3em] uppercase text-secondary font-bold mb-3">CMS Access</div>
            <h2 className="font-headline text-4xl font-extrabold text-primary mb-3">Sign in</h2>
            <p className="font-body text-on-surface-variant">For admins and editors of the Commission.</p>
          </div>
          <form onSubmit={submit} className="space-y-6" data-testid="login-form">
            <div>
              <label className="field-label">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" placeholder="admin@nscw.nagaland.gov.in" autoFocus data-testid="login-email" />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" data-testid="login-password" />
            </div>
            {error && <div className="text-sm font-body text-error bg-error-container/50 border border-error/20 rounded-lg px-4 py-3" data-testid="login-error">{error}</div>}
            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base" data-testid="login-submit">
              {submitting ? "Signing in…" : "Sign in to Dashboard"}
            </button>
          </form>
          <div className="mt-10 p-4 bg-surface-container rounded-lg font-body text-xs text-on-surface-variant opacity-80 leading-relaxed" data-testid="login-hint">
            <span className="font-label font-bold tracking-[0.2em] uppercase text-primary text-[10px]">Demo credentials</span>
            <div className="mt-2">Admin: <span className="font-mono">admin@nscw.nagaland.gov.in / Nscw@2026</span></div>
            <div>Editor: <span className="font-mono">editor@nscw.nagaland.gov.in / Editor@2026</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
