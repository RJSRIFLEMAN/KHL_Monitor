import { Activity, Check, Radio, Zap } from "lucide-react";

const commandOptions = [
  {
    label: "Nyalakan Pompa Paksa",
    command: "MANUAL_ON",
    icon: Zap,
    variant: "primary",
  },
  {
    label: "Matikan Pompa",
    command: "MANUAL_OFF",
    icon: Check,
    variant: "outline",
  },
  {
    label: "Mode Otomatis",
    command: "AUTO",
    icon: Activity,
    variant: "dark",
  },
];

function getButtonTone(variant) {
  if (variant === "primary") return "border-red-600 bg-red-600 text-white hover:bg-red-700";
  if (variant === "outline") return "border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50";
  return "border-slate-800 bg-slate-800 text-white hover:bg-slate-900";
}

function getCommandTone(variant) {
  if (variant === "primary") return "bg-white/15 text-white/80";
  if (variant === "dark") return "bg-white/10 text-white/70";
  return "bg-red-50 text-red-600";
}

export function ControlPanel({ connectionState, feedback, onPublish }) {
  const isConnected = connectionState === "connected";

  return (
    <article id="controls" className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Zap aria-hidden="true" size={16} />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Kontrol pompa</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Kendali manual perangkat mitigasi di area pemantauan.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
          <Radio aria-hidden="true" size={13} />
          {isConnected ? "Siap menerima perintah" : "Menunggu koneksi"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {commandOptions.map(({ label, command, icon: Icon, variant }) => (
          <button
            key={command}
            type="button"
            disabled={!isConnected}
            onClick={() => onPublish(command, label)}
            className={`flex min-h-[92px] flex-col items-start justify-between rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 ${getButtonTone(variant)}`}
          >
            <span className="flex w-full items-center justify-between">
              <Icon aria-hidden="true" size={18} />
              <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${getCommandTone(variant)}`}>
                {command}
              </span>
            </span>
            <span className="mt-4 text-xs font-semibold leading-4">{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-400">
        Perintah dikirim langsung ke perangkat melalui MQTT. Pastikan kondisi lapangan aman sebelum mengaktifkan pompa.
      </p>
      <p className="mt-2 min-h-5 text-xs font-medium text-slate-600" role="status" aria-live="polite">
        {feedback}
      </p>
    </article>
  );
}
