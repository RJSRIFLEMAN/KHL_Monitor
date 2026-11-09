"use client";

import { Droplet, Thermometer, Wind } from "lucide-react";
import { ControlPanel } from "./components/control-panel.js";
import { DashboardHeader, DashboardSidebar } from "./components/dashboard-navigation.js";
import { DevicePanel } from "./components/device-panel.js";
import { MetricCard } from "./components/metric-card.js";
import { StatusBanner } from "./components/status-banner.js";
import { getSensorStatus } from "./lib/sensor-status.js";
import { useMqttSensors } from "./lib/use-mqtt-sensors.js";

function formatTime(date) {
  if (!date) return "Belum ada pembaruan";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Home() {
  const { sensor, connectionState, lastUpdated, commandFeedback, publishCommand } =
    useMqttSensors();
  const status = getSensorStatus(sensor);

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <DashboardSidebar />
      <div className="lg:pl-[248px]">
        <DashboardHeader connectionState={connectionState} />
        <div id="overview" className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600">
                Pusat kendali
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.8rem]">
                Ringkasan kondisi lahan
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Pantau sensor dan kendalikan mitigasi secara real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                {connectionState === "connected" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    connectionState === "connected" ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
              </span>
              Pembaruan terakhir:{" "}
              <span className="font-medium text-slate-700">{formatTime(lastUpdated)}</span>
            </div>
          </section>

          <StatusBanner status={status} hasSensorData={Boolean(sensor)} />

          <section
            id="sensor"
            aria-label="Data sensor terkini"
            className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <MetricCard
              title="Suhu Tanah"
              subtitle="Sensor DS18B20"
              value={sensor ? sensor.suhu.toFixed(1) : "--"}
              unit="°C"
              icon={Thermometer}
              tone="red"
              isLive={Boolean(sensor)}
            />
            <MetricCard
              title="Kelembaban Tanah"
              subtitle="Nilai ADC · rentang 0–4095"
              value={sensor ? sensor.kelembaban.toLocaleString("id-ID") : "--"}
              unit="ADC"
              icon={Droplet}
              tone="blue"
              isLive={Boolean(sensor)}
            />
            <MetricCard
              title="Gas Karbon Monoksida"
              subtitle="Sensor MQ-7"
              value={sensor ? sensor.co_gas.toLocaleString("id-ID") : "--"}
              unit="PPM / ADC"
              icon={Wind}
              tone="slate"
              isLive={Boolean(sensor)}
            />
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <ControlPanel
              connectionState={connectionState}
              feedback={commandFeedback}
              onPublish={publishCommand}
            />
            <DevicePanel connectionState={connectionState} lastUpdated={lastUpdated} />
          </section>

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-4 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Sistem Mitigasi Karhutla Gambut</span>
            <span>Sensor: DS18B20 · kelembaban tanah · MQ-7</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
