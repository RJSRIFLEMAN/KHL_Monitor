import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";

const SENSOR_TOPIC = "karhutla/sensor_data";
const COMMAND_TOPIC = "karhutla/command";
const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_URL;
const INITIAL_CONNECTION_STATE = !MQTT_BROKER_URL
  ? "needs-config"
  : MQTT_BROKER_URL.startsWith("wss://")
    ? "connecting"
    : "error";

export function useMqttSensors() {
  const [sensor, setSensor] = useState(null);
  const [connectionState, setConnectionState] = useState(INITIAL_CONNECTION_STATE);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [commandFeedback, setCommandFeedback] = useState("");
  const clientRef = useRef(null);

  useEffect(() => {
    const brokerUrl = MQTT_BROKER_URL;
    if (!brokerUrl) return undefined;
    if (!brokerUrl.startsWith("wss://")) {
      console.error("MQTT broker URL must use secure WebSockets (wss://).");
      return undefined;
    }

    let active = true;
    let mqttClient;

    try {
      mqttClient = mqtt.connect(brokerUrl, {
        clientId: `khl-dashboard-${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        connectTimeout: 10_000,
        keepalive: 30,
        reconnectPeriod: 3_000,
        ...(process.env.NEXT_PUBLIC_MQTT_USERNAME
          ? { username: process.env.NEXT_PUBLIC_MQTT_USERNAME }
          : {}),
        ...(process.env.NEXT_PUBLIC_MQTT_PASSWORD
          ? { password: process.env.NEXT_PUBLIC_MQTT_PASSWORD }
          : {}),
      });
      clientRef.current = mqttClient;
    } catch (error) {
      console.error("Unable to initialize the MQTT connection.", error);
      queueMicrotask(() => active && setConnectionState("error"));
      return undefined;
    }

    mqttClient.on("connect", () => {
      if (!active) return;
      setConnectionState("connected");
      mqttClient.subscribe(SENSOR_TOPIC, { qos: 1 }, (error) => {
        if (error && active) {
          setConnectionState("error");
          console.error("Unable to subscribe to the sensor topic.", error);
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      if (!active || topic !== SENSOR_TOPIC) return;

      try {
        const parsed = JSON.parse(message.toString());
        if (
          typeof parsed.suhu !== "number" ||
          !Number.isFinite(parsed.suhu) ||
          parsed.suhu < -55 ||
          parsed.suhu > 125 ||
          !Number.isInteger(parsed.kelembaban) ||
          parsed.kelembaban < 0 ||
          parsed.kelembaban > 4095 ||
          !Number.isInteger(parsed.co_gas) ||
          parsed.co_gas < 0
        ) {
          throw new Error("Sensor payload contains invalid values.");
        }

        setSensor({
          suhu: parsed.suhu,
          kelembaban: parsed.kelembaban,
          co_gas: parsed.co_gas,
        });
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Ignoring invalid MQTT sensor payload.", error);
      }
    });

    mqttClient.on("reconnect", () => active && setConnectionState("reconnecting"));
    mqttClient.on("offline", () => active && setConnectionState("disconnected"));
    mqttClient.on("close", () => active && setConnectionState("disconnected"));
    mqttClient.on("error", (error) => {
      if (!active) return;
      setConnectionState("error");
      console.error("MQTT connection error.", error);
    });

    return () => {
      active = false;
      clientRef.current = null;
      mqttClient.end(true);
    };
  }, []);

  function publishCommand(command, label) {
    const client = clientRef.current;
    if (!client || !client.connected) {
      setCommandFeedback("Perintah tidak terkirim. Koneksi MQTT belum tersedia.");
      return;
    }

    setCommandFeedback("");
    client.publish(COMMAND_TOPIC, command, { qos: 1, retain: false }, (error) => {
      setCommandFeedback(
        error ? `Gagal mengirim perintah: ${label}.` : `Perintah "${label}" berhasil dikirim.`,
      );
    });
  }

  return { sensor, connectionState, lastUpdated, commandFeedback, publishCommand };
}
