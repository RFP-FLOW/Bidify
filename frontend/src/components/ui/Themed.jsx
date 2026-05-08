/* Shared themed UI primitives for the Employee module */

export function PageLayout({ children }) {
  return <div className="page-layout">{children}</div>;
}

export function PageContent({ children, className = "" }) {
  return <main className={`page-content ${className}`}>{children}</main>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex justify-between items-start mb-8 animate-fadeIn">
      <div>
        <h1 className="t-primary text-2xl font-bold tracking-[-0.02em] mb-1">{title}</h1>
        {subtitle && <p className="t-secondary text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "", delay = 0, ...props }) {
  return (
    <div
      className={`card animate-fadeIn ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <Card className="py-16 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
        style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
        <Icon size={22} />
      </div>
      <p className="t-primary text-base font-semibold mb-1">{title}</p>
      <p className="t-muted text-sm">{subtitle}</p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export function StatusBadge({ status }) {
  const map = {
    DRAFT:     { bg: "var(--status-draft-bg)", text: "var(--status-draft-text)", dot: "var(--status-draft-dot)", label: "Draft" },
    SENT:      { bg: "var(--status-sent-bg)",  text: "var(--status-sent-text)",  dot: "var(--status-sent-dot)",  label: "Sent" },
    FORWARDED: { bg: "var(--status-fwd-bg)",   text: "var(--status-fwd-text)",   dot: "var(--status-fwd-dot)",   label: "Forwarded" },
  };
  const c = map[status] || map.DRAFT;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

export function IconBox({ icon: Icon, size = 18, variant = "accent", className = "" }) {
  const variants = {
    accent: { background: "var(--accent-subtle)", color: "var(--accent-text)" },
    stat1:  { background: "var(--stat-1-accent-bg)", color: "var(--stat-1-accent)" },
    stat2:  { background: "var(--stat-2-accent-bg)", color: "var(--stat-2-accent)" },
    stat3:  { background: "var(--stat-3-accent-bg)", color: "var(--stat-3-accent)" },
  };
  const s = variants[variant] || variants.accent;
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${className}`} style={s}>
      <Icon size={size} />
    </div>
  );
}

export function SectionLabel({ children, icon: Icon }) {
  return (
    <p className="t-muted text-[11px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1">
      {Icon && <Icon size={11} />}
      {children}
    </p>
  );
}

export function LoadingSkeleton({ rows = 4, cardHeight = "h-[76px]" }) {
  return (
    <>
      <div className="h-8 w-48 rounded-lg animate-shimmer mb-2" />
      <div className="h-5 w-72 rounded-lg animate-shimmer mb-8" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={`${cardHeight} rounded-xl animate-shimmer mb-3`} />
      ))}
    </>
  );
}
