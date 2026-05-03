import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-purple-950 w-full py-16 px-6 md:px-12 border-t border-white/5 mt-auto" data-testid="public-footer">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-nowrap justify-center items-center gap-12 md:gap-20 pb-12 border-b border-white/5 overflow-x-auto">
          <img src="/images/GoN.webp" className="h-20 w-auto logo-float" style={{ animationDelay: "0s" }} alt="Government of Nagaland" />
          <img src="/images/ncw.webp" className="h-20 w-auto logo-float" style={{ animationDelay: "0.4s" }} alt="National Commission for Women" />
          <img src="/images/dsw.webp" className="h-20 w-auto logo-float" style={{ animationDelay: "0.8s" }} alt="Department of Social Welfare Nagaland" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-6">
            <img src="/images/ncw.webp" className="h-16 w-auto brightness-125" alt="NSCW Logo" />
            <div>
              <div className="font-headline font-black text-white text-2xl mb-1 tracking-widest uppercase">NSCW Nagaland</div>
              <p className="font-body text-xs tracking-wide text-purple-200/40">© 2026 Nagaland State Commission for Women. An Empowering Narrative.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center text-purple-300 font-body text-sm">
            <Link className="hover:text-white transition-colors" to="/">Home</Link>
            <Link className="hover:text-white transition-colors" to="/about">About</Link>
            <Link className="hover:text-white transition-colors" to="/legal-framework">Legal Framework</Link>
            <Link className="hover:text-white transition-colors" to="/updates">Updates</Link>
            <Link className="hover:text-white transition-colors" to="/support">Support</Link>
            <Link className="hover:text-white transition-colors text-secondary-container font-bold" to="/grievance">Report an Issue</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
