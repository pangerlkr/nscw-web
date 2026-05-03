export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-10 flex flex-wrap gap-6 justify-between items-start">
      <div>
        {eyebrow && <div className="font-label text-xs tracking-[0.3em] uppercase text-secondary font-bold mb-2">{eyebrow}</div>}
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-primary leading-tight tracking-tighter mb-3">{title}</h1>
        {description && <p className="font-body text-on-surface-variant max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, children, col = 1 }) {
  return (
    <div className={col === 2 ? "md:col-span-2" : ""}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

export function Input(props) { return <input {...props} className={`field-input ${props.className || ""}`} />; }
export function Textarea(props) { return <textarea {...props} className={`field-textarea ${props.className || ""}`} />; }
