import { Activity, Wifi } from "lucide-react";

function getConnectionLabel(connectionState) {
  if (connectionState === "connected") return "Online";
  if (connectionState === "connecting" || connectionState === "reconnecting") {
    return "Menyambungkan";
  }
  if (connectionState === "needs-config") return "Belum dikonfigurasi";
  if (connectionState === "error") return "Bermasalah";
  return "Offline";
}

function formatTime(date) {
  if (!date) return "Belum ada pembaruan";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function DevicePanel({ connectionState, lastUpdated }) {
  const hasSensorData = Boolean(lastUpdated);

  return (
    <article id="device" className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Activity aria-hidden="true" size={16} />
        </span>
        <h2 className="text-base font-semibold text-slate-900">Koneksi perangkat</h2>
      </div>
      <p className="mt-2 text-sm text-slate-500">Status jalur data monitoring.</p>

      <dl className="mt-5 divide-y divide-slate-100">
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="flex items-center gap-2 text-xs text-slate-500">
            <Wifi aria-hidden="true" size={14} /> Broker MQTT
          </dt>
          <dd className={`text-xs font-semibold ${connectionState === "connected" ? "text-emerald-700" : "text-slate-500"}`}>
            {getConnectionLabel(connectionState)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="text-xs text-slate-500">Topik sensor</dt>
          <dd className="max-w-[58%] truncate font-mono text-[10px] text-slate-700">
            karhutla/sensor_data
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="text-xs text-slate-500">Pembaruan data</dt>
          <dd className="text-xs font-medium text-slate-700">{formatTime(lastUpdated)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg bg-slate-50 p-3.5">
        <p className="text-xs font-semibold text-slate-700">Aktivitas sensor</p>
        <p className="mt-1 text-xs leading-5 text-slate-500" aria-live="polite">
          {hasSensorData
            ? `Data suhu, kelembaban, dan CO diterima pada ${formatTime(lastUpdated)}.`
            : connectionState === "needs-config"
              ? "Atur URL broker dan kredensial MQTT pada file .env.local."
              : "Belum ada data sensor. Pastikan perangkat mengirim payload JSON ke topik monitoring."}
        </p>
      </div>
    </article>
  );
}
