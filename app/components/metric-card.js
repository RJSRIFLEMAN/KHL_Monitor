export function MetricCard({ title, subtitle, value, unit, icon: Icon, tone, isLive }) {
  const iconTones = {
    red: "bg-red-50 text-red-600",
    blue: "bg-sky-50 text-sky-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="metric-card rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconTones[tone]}`}>
            <Icon aria-hidden="true" size={21} strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            isLive ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
          }`}
        >
          {isLive ? "Live" : "Menunggu"}
        </span>
      </div>
      <div className="mt-7 flex items-end gap-2">
        <span className="font-mono text-4xl font-semibold tracking-tight text-slate-900 sm:text-[2.65rem]">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-500">{unit}</span>
      </div>
      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
        <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-500" : "bg-slate-300"}`} />
        {isLive ? "Pembacaan sensor diterima" : "Menunggu pembacaan sensor"}
      </div>
    </article>
  );
}
