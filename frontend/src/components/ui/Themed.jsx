/* Shared themed UI primitives for the Employee module */
import { FileText, Search } from "lucide-react";
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
    DRAFT: { bg: "var(--status-draft-bg)", text: "var(--status-draft-text)", dot: "var(--status-draft-dot)", label: "Draft" },
    SENT: { bg: "var(--status-sent-bg)", text: "var(--status-sent-text)", dot: "var(--status-sent-dot)", label: "Sent" },
    FORWARDED: { bg: "var(--status-fwd-bg)", text: "var(--status-fwd-text)", dot: "var(--status-fwd-dot)", label: "Forwarded" },
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
    stat1: { background: "var(--stat-1-accent-bg)", color: "var(--stat-1-accent)" },
    stat2: { background: "var(--stat-2-accent-bg)", color: "var(--stat-2-accent)" },
    stat3: { background: "var(--stat-3-accent-bg)", color: "var(--stat-3-accent)" },
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


export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 t-muted" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-themed !w-[220px] !pl-9 !py-2 !text-xs !rounded-lg"
      />
    </div>
  );
}



export function ManagerPageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <div className="flex justify-between items-start mb-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
          <Icon size={26} />
        </div>
        <div>
          <h1 className="t-primary text-2xl font-bold tracking-[-0.02em]">{title}</h1>
          <p className="t-muted text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}


export function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-5 mb-8">
      {stats.map(({ label, value, sub, icon: Icon, variant }, i) => (
        <div key={label} className="rounded-2xl p-5 animate-fadeIn hover:translate-y-[-2px] transition-all duration-300 cursor-default"
          style={{ background: `var(--stat-${i + 1}-bg)`, border: `1px solid var(--stat-${i + 1}-border)`, boxShadow: "var(--shadow-sm)", animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center gap-3 mb-3">
            <IconBox icon={Icon} variant={variant} className="w-10 h-10" size={18} />
            <span className="t-secondary text-sm font-medium">{label}</span>
          </div>
          <p className="text-3xl font-bold tracking-tight mb-0.5" style={{ color: `var(--stat-${i + 1}-value)` }}>{value}</p>
          <p className="t-muted text-xs">{sub}</p>
        </div>
      ))}
    </div>
  );
}