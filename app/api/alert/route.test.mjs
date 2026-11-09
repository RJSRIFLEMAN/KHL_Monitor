import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { POST } from "./route.js";

const originalFetch = globalThis.fetch;
const originalEnvironment = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  ALERT_WEBHOOK_SECRET: process.env.ALERT_WEBHOOK_SECRET,
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("rejects alert requests without the ESP32 webhook secret", async () => {
  process.env.ALERT_WEBHOOK_SECRET = "test-webhook-secret";
  const response = await POST(
    new Request("http://localhost/api/alert", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ suhu: 60, kelembaban: 900, lokasi: "Riau", status: "BAHAYA" }),
    }),
  );

  assert.equal(response.status, 401);
});

test("sends a validated alert to Telegram and escapes MarkdownV2 input", async () => {
  process.env.ALERT_WEBHOOK_SECRET = "test-webhook-secret";
  process.env.TELEGRAM_BOT_TOKEN = "test-token";
  process.env.TELEGRAM_CHAT_ID = "test-chat";
  let telegramRequest;
  globalThis.fetch = async (url, options) => {
    telegramRequest = { url, options };
    return Response.json({ ok: true });
  };

  const response = await POST(
    new Request("http://localhost/api/alert", {
      method: "POST",
      headers: {
        authorization: "Bearer test-webhook-secret",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        suhu: 60.5,
        kelembaban: 1800,
        lokasi: "Blok_2!",
        status: "BAHAYA DARURAT",
      }),
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(telegramRequest.options.method, "POST");
  const telegramBody = JSON.parse(telegramRequest.options.body);
  assert.equal(telegramBody.parse_mode, "MarkdownV2");
  assert.match(telegramBody.text, /Blok\\_2\\!/);
});

test("rejects out-of-range sensor data without calling Telegram", async () => {
  process.env.ALERT_WEBHOOK_SECRET = "test-webhook-secret";
  let telegramWasCalled = false;
  globalThis.fetch = async () => {
    telegramWasCalled = true;
    return Response.json({ ok: true });
  };

  const response = await POST(
    new Request("http://localhost/api/alert", {
      method: "POST",
      headers: {
        authorization: "Bearer test-webhook-secret",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        suhu: 60,
        kelembaban: 5000,
        lokasi: "Riau",
        status: "BAHAYA DARURAT",
      }),
    }),
  );

  assert.equal(response.status, 422);
  assert.equal(telegramWasCalled, false);
});
