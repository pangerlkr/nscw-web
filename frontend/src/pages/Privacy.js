export default function Privacy() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="privacy-page">
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-tertiary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-tertiary font-bold">Privacy Protocol</span>
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-primary leading-tight tracking-tighter mb-8">
          The <span className="italic font-light">Privacy</span> Protocol
        </h1>
        <div className="font-body text-on-surface leading-relaxed space-y-6 opacity-90">
          <p>NSCW is committed to protecting the privacy of every citizen who engages with our digital services. This protocol outlines the scope, safeguards, and rights associated with data submitted through this website.</p>
          <h2 className="font-headline text-xl font-bold text-primary mt-10">Scope</h2>
          <p>We collect only information that is necessary to process grievances, send institutional communications, or provide the services requested by the user.</p>
          <h2 className="font-headline text-xl font-bold text-primary mt-10">Safeguards</h2>
          <p>All submissions are stored on secure infrastructure. Access is restricted to authorised officers of the Commission on a need-to-know basis.</p>
          <h2 className="font-headline text-xl font-bold text-primary mt-10">Your Rights</h2>
          <p>You may request access, rectification, or deletion of your submitted data by contacting the Commission via the Connect page.</p>
        </div>
      </section>
    </div>
  );
}
