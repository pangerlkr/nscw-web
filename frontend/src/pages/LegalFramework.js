export default function LegalFramework() {
  const acts = [
    { title: "The Nagaland State Commission for Women Act", year: "2006", body: "The foundational statute that established the Nagaland State Commission for Women as a statutory body to safeguard and promote the rights of women in Nagaland." },
    { title: "The Protection of Women from Domestic Violence Act", year: "2005", body: "Provides civil remedies to women who are victims of domestic violence in a domestic relationship." },
    { title: "The Sexual Harassment of Women at Workplace Act", year: "2013", body: "Legislative measures to provide a safe workplace for women. Governs Internal Committee (IC) constitution and redressal procedures." },
    { title: "The Dowry Prohibition Act", year: "1961", body: "Prohibits the giving or taking of dowry and penalises offenders. A cornerstone of women's economic protection." },
  ];
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24" data-testid="legal-page">
      <section className="max-w-5xl mx-auto mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-secondary"></div>
          <span className="font-label text-sm uppercase tracking-widest text-secondary font-bold">Legal Framework</span>
        </div>
        <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary leading-tight tracking-tighter mb-8">
          Acts, Rules & <span className="italic font-light">Safeguards</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-3xl">The legislative framework that empowers NSCW to protect women's rights in Nagaland.</p>
      </section>

      <section className="max-w-5xl mx-auto space-y-8">
        {acts.map((a) => (
          <div key={a.title} className="cms-card flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-40 flex-shrink-0">
              <div className="font-headline font-black text-5xl text-primary/30">{a.year}</div>
              <div className="font-label text-[10px] tracking-[0.25em] uppercase text-tertiary font-bold mt-2">Enacted</div>
            </div>
            <div className="flex-1">
              <h3 className="font-headline text-2xl font-bold text-primary mb-3">{a.title}</h3>
              <p className="font-body text-on-surface-variant leading-relaxed mb-6">{a.body}</p>
              <a href="/NL-NSCW-Act.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-headline font-bold text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">description</span>
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
