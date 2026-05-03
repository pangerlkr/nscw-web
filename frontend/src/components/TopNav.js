import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LINKS = [
  { to: "/", label: "Introduction" },
  { to: "/about", label: "Our Mission" },
  { to: "/legal-framework", label: "Legal Framework" },
  { to: "/updates", label: "Updates" },
  { to: "/connect", label: "Connect" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-purple-900/80 backdrop-blur-lg flex justify-between items-center px-6 md:px-12 py-3 md:py-4 transition-all duration-300"
      data-testid="public-topnav"
    >
      <Link to="/" className="flex items-center gap-4 group" data-testid="nav-logo-link">
        <img src="/images/ncw.webp" alt="NSCW Logo" className="h-10 md:h-12 w-auto drop-shadow-lg group-hover:scale-105 transition-transform" />
        <div className="flex flex-col">
          <div className="text-lg font-headline font-black uppercase tracking-widest text-white leading-none">NSCW</div>
          <div className="text-[10px] font-label font-bold text-purple-200/60 tracking-[0.2em] uppercase mt-1">Nagaland</div>
        </div>
      </Link>

      <div className="hidden md:flex gap-10 items-center font-headline font-medium tracking-wide">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              isActive
                ? "text-sky-300 border-b-2 border-sky-300 pb-1"
                : "text-white/70 hover:text-sky-300 transition-all duration-300"
            }
            data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/grievance")}
          className="hidden sm:block bg-primary text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:scale-95"
          data-testid="nav-grievance-cta"
        >
          Report an Issue
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white/80 p-2 material-symbols-outlined"
          aria-label="Toggle menu"
          data-testid="mobile-menu-toggle"
        >
          {open ? "close" : "menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-purple-950/95 backdrop-blur-xl flex flex-col p-8 gap-6 border-t border-white/10 shadow-2xl z-50">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className="text-white/80 hover:text-sky-300 font-headline font-medium"
              data-testid={`mobile-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => navigate("/grievance")}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm tracking-wider uppercase"
            data-testid="mobile-grievance-cta"
          >
            Report an Issue
          </button>
        </div>
      )}
    </nav>
  );
}
