import { Activity, BellRing, Flame, Radio, ShieldCheck } from "lucide-react";

const statusIcons = {
  danger: Flame,
  warning: BellRing,
  safe: ShieldCheck,
  neutral: Radio,
};

const bannerTones = {
  danger: {
    surface: "border-red-200 bg-red-50",
    icon: "bg-red-600 text-white",
    heading: "text-red-700",
  },
  warning: {
    surface: "border-amber-200 bg-amber-50",
    icon: "bg-amber-500 text-white",
    heading: "text-amber-800",
  },
  safe: {
    surface: "border-emerald-200 bg-emerald-50",
    icon: "bg-emerald-600 text-white",
    heading: "text-emerald-800",
  },
  neutral: {
    surface: "border-slate-200 bg-white",
    icon: "bg-slate-100 text-slate-500",
    heading: "text-slate-700",
  },
};

export function StatusBanner({ status, hasSensorData }) {
  const Icon = statusIcons[status.tone] ?? Activity;
  const tone = bannerTones[status.tone] ?? bannerTones.neutral;

  return (
    <section
      aria-labelledby="status-heading"
      className={`status-banner mt-7 overflow-hidden rounded-xl border p-5 sm:p-6 ${tone.surface}`}
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
            <Icon
              aria-hidden="true"
              size={22}
              className={status.tone === "danger" ? "animate-pulse" : ""}
            />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Status area
            </p>
            <h2 id="status-heading" className={`mt-1 text-lg font-bold tracking-tight sm:text-xl ${tone.heading}`}>
              {status.label}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">
              {status.description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-black/5 bg-white/70 px-3 py-2 text-xs font-medium text-slate-600">
          <Activity aria-hidden="true" size={15} />
          {hasSensorData ? "Data sensor diterima" : "Menunggu data sensor"}
        </div>
      </div>
    </section>
  );
}
