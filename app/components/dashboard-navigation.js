import {
  ChevronDown,
  CircleHelp,
  Flame,
  LayoutDashboard,
  Map,
  Radio,
  ShieldCheck,
  Wifi,
  WifiOff,
  Zap,
  Thermometer,
} from "lucide-react";

const navigation = [
  { label: "Ringkasan", href: "#overview", icon: LayoutDashboard, active: true },
  { label: "Data sensor", href: "#sensor", icon: Thermometer },
  { label: "Kontrol pompa", href: "#controls", icon: Zap },
  { label: "Koneksi perangkat", href: "#device", icon: Radio },
];

const connectionLabels = {
  connected: "Terhubung",
  connecting: "Menghubungkan",
  reconnecting: "Menyambungkan ulang",
  disconnected: "Terputus",
  error: "Koneksi bermasalah",
  "needs-config": "MQTT belum dikonfigurasi",
};

function ConnectionBadge({ state }) {
  const isConnected = state === "connected";
  const Icon = isConnected ? Wifi : WifiOff;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
        isConnected
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600"
      }`}
      role="status"
    >
      <Icon aria-hidden="true" size={14} />
      {connectionLabels[state]}
      {state === "connecting" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
      )}
    </span>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-slate-200 bg-white lg:flex">
      <a href="#overview" className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-200">
          <Flame aria-hidden="true" size={22} />
        </span>
        <span>
          <span className="block text-sm font-bold tracking-tight text-slate-900">KARHUTLA</span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Command Center
          </span>
        </span>
      </a>

      <div className="px-4 pt-8">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Monitoring
        </p>
        <nav aria-label="Navigasi utama" className="mt-3 space-y-1">
          {navigation.map(({ label, href, icon: Icon, active }) => (
            <a
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-red-50 text-red-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
              {label === "Koneksi perangkat" && (
                <span className="ml-auto h-2 w-2 rounded-full bg-slate-300" />
              )}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-red-100 bg-red-50/70 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <CircleHelp aria-hidden="true" size={16} />
            <span className="text-xs font-semibold">Butuh bantuan?</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Pastikan perangkat IoT terhubung sebelum mengirim perintah pompa.
          </p>
        </div>
        <p className="mt-4 px-1 text-[10px] text-slate-400">Sistem Mitigasi Gambut · v1.0</p>
      </div>
    </aside>
  );
}

export function DashboardHeader({ connectionState }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="flex h-[68px] items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white lg:hidden">
            <Flame aria-hidden="true" size={19} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              Karhutla Command Center
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Sistem mitigasi kebakaran lahan gambut
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionBadge state={connectionState} />
          <span className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="hidden items-center gap-2 text-left sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <Map aria-hidden="true" size={15} />
            </span>
            <span className="hidden text-xs font-medium text-slate-700 md:block">
              Wilayah pemantauan
            </span>
            <ChevronDown aria-hidden="true" size={14} className="text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
