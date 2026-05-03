export default function Connect() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="connect-page">
      <section className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-secondary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold">Connect</span>
        </div>
        <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary leading-tight tracking-tighter mb-8">
          Get in <span className="italic font-light">Touch</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-3xl">The Commission welcomes all communications. Reach us via the contact channels below or submit a formal grievance.</p>
      </section>
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="cms-card">
          <span className="material-symbols-outlined text-primary text-3xl mb-4 block">location_on</span>
          <div className="font-label text-[10px] tracking-[0.25em] uppercase text-tertiary font-bold mb-2">Office</div>
          <p className="font-body text-on-surface leading-relaxed">NSCW Secretariat<br/>Kohima, Nagaland<br/>Pin - 797001</p>
        </div>
        <div className="cms-card">
          <span className="material-symbols-outlined text-primary text-3xl mb-4 block">call</span>
          <div className="font-label text-[10px] tracking-[0.25em] uppercase text-tertiary font-bold mb-2">Phone</div>
          <a href="tel:+913702260000" className="font-body text-on-surface hover:text-primary">+91-370-2260000</a>
        </div>
        <div className="cms-card">
          <span className="material-symbols-outlined text-primary text-3xl mb-4 block">mail</span>
          <div className="font-label text-[10px] tracking-[0.25em] uppercase text-tertiary font-bold mb-2">Email</div>
          <a href="mailto:nscw.nagaland@gov.in" className="font-body text-on-surface hover:text-primary break-all">nscw.nagaland@gov.in</a>
        </div>
      </section>
    </div>
  );
}
