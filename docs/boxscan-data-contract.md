# BoxScan B data contract v1.0

This contract is shared by firmware, API and browser app. A payload represents readings from a named source; it is not a safety certificate or diagnosis.

## Example payload (fictional values)
{
  "schemaVersion": "1.0",
  "deviceId": "BoxScan-B-001",
  "panelId": "PANEL-01",
  "capturedAt": "2026-10-25T12:00:00Z",
  "source": "modbus_meter",
  "meterModel": "EXACT-METER-MODEL",
  "dataMode": "live_meter",
  "circuit": { "id": "C07", "label": "Steckdosen Küche", "labelVerified": false },
  "measurements": { "voltageV": 230.4, "currentA": 4.2, "activePowerW": 910, "energyKWh": 125.7 },
  "quality": { "communicationOk": true, "measurementValid": false, "registerMapVerified": false }
}

Numbers above are illustrative, not real readings. Do not mark measurements valid until the meter, register map, scaling, phase mapping, timestamp and reference readings have been verified.

## Required fields
- schemaVersion: currently 1.0.
- deviceId, capturedAt (UTC ISO 8601), source, dataMode.
- measurements: at least one supported numeric field.
- quality: communicationOk, measurementValid, registerMapVerified.
- Measurement fields use explicit units in their names. Unknown values should be omitted or null, not set to zero.

## Endpoint contract
- POST /api/boxscan/measurements
- Content-Type: application/json
- Authentication: per-device bearer token, stored in server secret manager.
- Server validates payload size, types, timestamp, token and numeric values.
- Device must validate TLS server certificates. Never disable certificate validation.
- Static GitHub Pages cannot receive device uploads by itself; a separately hosted API is required.
- Avoid customer names, addresses, access credentials and unnecessary personal data.

## Browser import
The app can import JSON locally. Import is not a live hardware connection. Display source, capture time and quality flags; unverified values must remain visibly unverified.
