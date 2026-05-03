import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6" data-testid="not-found-page">
      <div className="text-center max-w-lg">
        <div className="font-headline font-black text-8xl text-primary/30 mb-6">404</div>
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-4">Page not found</h1>
        <p className="font-body text-on-surface-variant mb-10">The page you requested has drifted off the chronicle. Let's take you back home.</p>
        <Link to="/" className="btn-primary inline-block">Return Home</Link>
      </div>
    </div>
  );
}
