# Karhutla Command Center

Dashboard Next.js untuk memantau sensor mitigasi kebakaran lahan gambut dan mengirim perintah pompa melalui MQTT.

## Menjalankan aplikasi

1. Salin `.env.example` menjadi `.env.local`, lalu isi URL broker dan kredensial HiveMQ serta konfigurasi Telegram.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`, kemudian buka `http://localhost:3000`.

Jalankan `npm test`, `npm run lint`, dan `npm run build` untuk pemeriksaan lokal.

## Konfigurasi MQTT

Dashboard menggunakan koneksi secure WebSocket (`wss://`) dan berlangganan ke `karhutla/sensor_data`. Payload sensor yang diharapkan:

```json
{"suhu": 42.5, "kelembaban": 1200, "co_gas": 18}
```

Tombol kontrol menerbitkan `MANUAL_ON`, `MANUAL_OFF`, atau `AUTO` ke `karhutla/command`. Karena koneksi MQTT berjalan di browser, variabel `NEXT_PUBLIC_MQTT_USERNAME` dan `NEXT_PUBLIC_MQTT_PASSWORD` dapat dilihat oleh pengguna. Gunakan kredensial khusus dashboard dengan ACL minimum: hanya baca topik sensor dan hanya tulis topik perintah.

Prioritas status dashboard: suhu `>= 55 °C` adalah bahaya darurat; kelembaban `> 1500` adalah rawan kekeringan; suhu `< 45 °C` adalah aman; rentang lainnya ditampilkan sebagai siaga pemantauan.

## Alert Telegram dari ESP32

`POST /api/alert` menerima `suhu`, `kelembaban`, `lokasi`, dan `status`. Permintaan wajib menyertakan header:

```text
Authorization: Bearer <ALERT_WEBHOOK_SECRET>
```

Endpoint menolak payload tidak valid, membatasi ukuran body, lalu mengirim notifikasi MarkdownV2 ke `TELEGRAM_CHAT_ID`. Atur `ALERT_WEBHOOK_SECRET` sebagai rahasia acak yang sama di konfigurasi ESP32 dan Vercel. Jangan mengirim rahasia Telegram atau webhook ke variabel `NEXT_PUBLIC_*`.

## Deploy ke Vercel

Tambahkan semua variabel environment dari `.env.example` di pengaturan proyek Vercel. Gunakan kredensial broker dan rahasia Telegram/webhook produksi yang berbeda dari kredensial development.
