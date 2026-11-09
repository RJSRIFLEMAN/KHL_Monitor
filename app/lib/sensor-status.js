export function getSensorStatus(sensor) {
  if (!sensor) {
    return {
      label: "MENUNGGU DATA",
      description: "Status akan diperbarui saat data sensor diterima.",
      tone: "neutral",
    };
  }

  if (sensor.suhu >= 55) {
    return {
      label: "BAHAYA DARURAT",
      description: "Suhu tanah melewati ambang darurat. Segera lakukan verifikasi lapangan.",
      tone: "danger",
    };
  }

  if (sensor.kelembaban > 1500) {
    return {
      label: "RAWAN KEKERINGAN",
      description: "Kelembaban tanah rendah. Tingkatkan pemantauan area.",
      tone: "warning",
    };
  }

  if (sensor.suhu < 45) {
    return {
      label: "AMAN",
      description: "Parameter suhu dan kelembaban berada dalam rentang aman.",
      tone: "safe",
    };
  }

  return {
    label: "SIAGA PEMANTAUAN",
    description: "Parameter suhu meningkat. Pantau kondisi sensor secara berkala.",
    tone: "warning",
  };
}
