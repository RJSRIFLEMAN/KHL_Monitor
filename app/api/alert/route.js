import { timingSafeEqual } from "node:crypto";

const MAX_BODY_BYTES = 8_192;

function jsonResponse(body, status) {
  return Response.json(body, { status });
}

function isAuthorized(request, secret) {
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);

  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

function escapeMarkdown(value) {
  return value.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function validateAlert(payload) {
  return (
    payload !== null &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    typeof payload.suhu === "number" &&
    Number.isFinite(payload.suhu) &&
    payload.suhu >= -55 &&
    payload.suhu <= 125 &&
    Number.isInteger(payload.kelembaban) &&
    payload.kelembaban >= 0 &&
    payload.kelembaban <= 4095 &&
    typeof payload.lokasi === "string" &&
    payload.lokasi.trim().length > 0 &&
    payload.lokasi.length <= 120 &&
    typeof payload.status === "string" &&
    payload.status.trim().length > 0 &&
    payload.status.length <= 80
  );
}

async function readLimitedBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return { body: "" };

  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return { tooLarge: true };
    }
    chunks.push(value);
  }

  return { body: Buffer.concat(chunks).toString("utf8") };
}

export async function POST(request) {
  const webhookSecret = process.env.ALERT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return jsonResponse({ error: "Alert service is not configured." }, 503);
  }

  if (!isAuthorized(request, webhookSecret)) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }

  let readResult;
  try {
    readResult = await readLimitedBody(request);
  } catch {
    return jsonResponse({ error: "Unable to read request body." }, 400);
  }

  if (readResult.tooLarge) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }

  let payload;
  try {
    payload = JSON.parse(readResult.body);
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  if (!validateAlert(payload)) {
    return jsonResponse({ error: "Invalid alert payload." }, 422);
  }

  const { TELEGRAM_BOT_TOKEN: botToken, TELEGRAM_CHAT_ID: chatId } = process.env;
  if (!botToken || !chatId) {
    return jsonResponse({ error: "Telegram notifications are not configured." }, 503);
  }

  const message = [
    "*🚨 PERINGATAN DARURAT KARHUTLA — SATGAS*",
    "",
    `*Status:* ${escapeMarkdown(payload.status)}`,
    `*Lokasi:* ${escapeMarkdown(payload.lokasi.trim())}`,
    `*Suhu tanah:* ${escapeMarkdown(String(payload.suhu))} °C`,
    `*Kelembaban tanah:* ${escapeMarkdown(String(payload.kelembaban))} ADC`,
  ].join("\n");

  let telegramResponse;
  try {
    telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "MarkdownV2",
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    console.error("Telegram alert delivery failed.");
    return jsonResponse({ error: "Unable to deliver alert notification." }, 502);
  }

  let telegramResult;
  try {
    telegramResult = await telegramResponse.json();
  } catch {
    telegramResult = null;
  }

  if (!telegramResponse.ok || telegramResult?.ok !== true) {
    console.error("Telegram rejected the alert notification.");
    return jsonResponse({ error: "Unable to deliver alert notification." }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}
