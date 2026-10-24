/*
 * ElektroPilot BoxScan B — firmware scaffold.
 * Not certified. Not for direct mains wiring or safety decisions.
 * ESP32 UART <-> GALVANICALLY ISOLATED RS-485 interface <-> commercial meter.
 *
 * Install Arduino libraries: ModbusMaster and ArduinoJson.
 * Copy secrets.example.h to secrets.h locally (do not commit secrets.h).
 * Keep METER_REGISTER_MAP_CONFIGURED=0 until the exact meter manual has
 * been reviewed and the register map/scaling verified on a safe bench.
 */
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ModbusMaster.h>
#include "secrets.h"

static constexpr int RS485_RX_PIN = 16;
static constexpr int RS485_TX_PIN = 17;
static constexpr int RS485_DE_RE_PIN = 4;
static constexpr uint32_t MODBUS_BAUD = 9600;
static constexpr uint8_t METER_SLAVE_ID = 1;
static constexpr uint32_t POLL_INTERVAL_MS = 10000;

// Deliberately disabled until exact meter registers/scaling are verified.
#define METER_REGISTER_MAP_CONFIGURED 0

// Placeholders only. These are NOT valid for an arbitrary meter.
static constexpr uint16_t REG_VOLTAGE_PLACEHOLDER = 0x0000;
static constexpr uint16_t REG_CURRENT_PLACEHOLDER = 0x0000;
static constexpr uint16_t REG_POWER_PLACEHOLDER = 0x0000;
static constexpr uint16_t REG_ENERGY_PLACEHOLDER = 0x0000;
static constexpr float VOLTAGE_SCALE_PLACEHOLDER = 0.1f;
static constexpr float CURRENT_SCALE_PLACEHOLDER = 0.001f;
static constexpr float POWER_SCALE_PLACEHOLDER = 1.0f;
static constexpr float ENERGY_SCALE_PLACEHOLDER = 0.01f;

ModbusMaster meter;
uint32_t lastPoll = 0;

void preTransmission() { digitalWrite(RS485_DE_RE_PIN, HIGH); }
void postTransmission() { digitalWrite(RS485_DE_RE_PIN, LOW); }

bool readInputRegister(uint16_t address, uint16_t &value) {
  uint8_t result = meter.readInputRegisters(address, 1);
  if (result != meter.ku8MBSuccess) return false;
  value = meter.getResponseBuffer(0);
  return true;
}

String isoTimestampUtc() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo, 1000)) return "";
  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buf);
}

void sendReading(float voltageV, float currentA, float activePowerW, float energyKWh) {
  if (WiFi.status() != WL_CONNECTED) return;
  String capturedAt = isoTimestampUtc();
  if (capturedAt.length() == 0) {
    Serial.println("Clock not synchronized; refusing to label reading as timestamped.");
    return;
  }

  StaticJsonDocument<768> doc;
  doc["schemaVersion"] = "1.0";
  doc["deviceId"] = "BoxScan-B-001"; // Replace with a provisioned unique ID.
  doc["panelId"] = "PANEL-UNASSIGNED";
  doc["capturedAt"] = capturedAt;
  doc["source"] = "modbus_meter";
  doc["meterModel"] = "SET_REAL_METER_MODEL";
  doc["dataMode"] = "live_meter";
  doc["quality"]["communicationOk"] = true;
  doc["quality"]["measurementValid"] = false; // Enable only after validation.
  doc["quality"]["registerMapVerified"] = false;
  JsonObject circuit = doc.createNestedObject("circuit");
  circuit["id"] = "CIRCUIT-UNASSIGNED";
  circuit["label"] = "";
  circuit["labelVerified"] = false;
  JsonObject measurements = doc.createNestedObject("measurements");
  measurements["voltageV"] = voltageV;
  measurements["currentA"] = currentA;
  measurements["activePowerW"] = activePowerW;
  measurements["energyKWh"] = energyKWh;

  String payload;
  serializeJson(doc, payload);
  Serial.println("Reading packaged, but upload disabled until TLS CA and API are configured.");
  Serial.println(payload);

  WiFiClientSecure tls;
  // Install the correct root CA using tls.setCACert(ROOT_CA_CERT_PEM).
  // Never use tls.setInsecure() in production.
  // HTTPClient http;
  // if (!http.begin(tls, BOXSCAN_API_URL)) return;
  // http.addHeader("Content-Type", "application/json");
  // http.addHeader("Authorization", String("Bearer ") + BOXSCAN_DEVICE_TOKEN);
  // int status = http.POST(payload);
  // Serial.printf("Upload HTTP status: %d\n", status);
  // http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(RS485_DE_RE_PIN, OUTPUT);
  digitalWrite(RS485_DE_RE_PIN, LOW);
  Serial2.begin(MODBUS_BAUD, SERIAL_8N1, RS485_RX_PIN, RS485_TX_PIN);
  meter.begin(METER_SLAVE_ID, Serial2);
  meter.preTransmission(preTransmission);
  meter.postTransmission(postTransmission);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("BoxScan B bench scaffold starting.");
  Serial.println("No readings until a verified register map is configured.");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) { delay(1000); return; }
  if (millis() - lastPoll < POLL_INTERVAL_MS) return;
  lastPoll = millis();
#if METER_REGISTER_MAP_CONFIGURED
  uint16_t rawV, rawI, rawP, rawE;
  const bool ok = readInputRegister(REG_VOLTAGE_PLACEHOLDER, rawV)
    && readInputRegister(REG_CURRENT_PLACEHOLDER, rawI)
    && readInputRegister(REG_POWER_PLACEHOLDER, rawP)
    && readInputRegister(REG_ENERGY_PLACEHOLDER, rawE);
  if (!ok) { Serial.println("Meter read failed; no measurement uploaded."); return; }
  sendReading(rawV * VOLTAGE_SCALE_PLACEHOLDER, rawI * CURRENT_SCALE_PLACEHOLDER,
              rawP * POWER_SCALE_PLACEHOLDER, rawE * ENERGY_SCALE_PLACEHOLDER);
#else
  Serial.println("SAFE DEFAULT: register map disabled; no polling or uploads.");
#endif
}
