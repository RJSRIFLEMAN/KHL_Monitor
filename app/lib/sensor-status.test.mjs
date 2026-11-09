import assert from "node:assert/strict";
import { test } from "node:test";
import { getSensorStatus } from "./sensor-status.js";

test("reports safe status below 45 degrees when the soil is not dry", () => {
  assert.equal(getSensorStatus({ suhu: 44.9, kelembaban: 1500 }).label, "AMAN");
});

test("reports dry conditions when moisture exceeds 1500", () => {
  assert.equal(getSensorStatus({ suhu: 45, kelembaban: 1501 }).label, "RAWAN KEKERINGAN");
});

test("prioritizes emergency temperature over dry-soil status", () => {
  assert.equal(getSensorStatus({ suhu: 55, kelembaban: 2000 }).label, "BAHAYA DARURAT");
});

test("reports monitoring status between safe and emergency thresholds", () => {
  assert.equal(getSensorStatus({ suhu: 50, kelembaban: 1500 }).label, "SIAGA PEMANTAUAN");
});
