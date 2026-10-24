# ElektroPilot BoxScan B — hardware prototype

**Status: design/bench prototype only. Not certified and not safe for direct mains experimentation.**

## Purpose
Read documented measurements from a compatible, commercially manufactured DIN-rail meter over an isolated RS-485 interface, package readings with source/time/quality metadata, and send them to a configured HTTPS endpoint. The prototype does not switch circuits, operate protective devices, or certify an installation.

## Block diagram
DIN meter with documented Modbus map → galvanically isolated RS-485 interface → ESP32-class controller → HTTPS → ElektroPilot API → browser app.

Use an appropriate SELV supply for the controller. Keep hazardous meter terminals and wiring outside the low-voltage development area. Do not connect an ESP32, USB adapter, breadboard, or non-rated RS-485 board directly to mains conductors.

## Candidate bill of materials (not an approved BOM)
- ESP32 development board for bench-only prototype.
- Galvanically isolated RS-485 transceiver/interface compatible with the selected meter and controller logic levels.
- Commercial DIN-rail energy meter with documented Modbus register map and required quantities.
- Appropriate SELV supply and protected enclosure for the intended environment.
- Properly rated terminals, wiring, strain relief and enclosure accessories selected by a qualified designer.

No exact meter or register addresses are specified because Modbus maps differ by model.

## Firmware setup
1. Install Arduino IDE, ESP32 board package, ModbusMaster and ArduinoJson libraries.
2. Copy secrets.example.h to secrets.h locally; fill Wi-Fi, API URL and device token. Never commit secrets.
3. In boxscan_b.ino, configure register addresses, scaling, meter slave ID and serial settings from the exact meter manual. Keep METER_REGISTER_MAP_CONFIGURED at 0 until verified against that manual and tested on an isolated bench.
4. Use the exact meter's documented function code, register types, byte order and scaling. The example intentionally does not enable measurement polling by default.
5. Validate readings against a suitable calibrated reference before any pilot.

## Data flow and limitations
- Device sends JSON to POST /api/boxscan/measurements.
- Measurements include source, capture timestamp, meter identity and quality flags.
- Browser app can import an exported JSON locally; import is not a live hardware connection.
- Live device upload requires a separately deployed API, TLS, authentication and device provisioning.
- Firmware is not a protective device, safety tester, certified meter, or substitute for meter installation instructions.

## Safety and compliance before installation
A qualified electrical designer must determine meter category/rating, overvoltage category, rated voltage, isolation/creepage/clearance, short-circuit and overcurrent protection, EMC, temperature, enclosure/IP rating, terminals, wiring, supply, mounting, fire behaviour and fault behaviour for the actual installation. Review applicable German/EU requirements and conformity obligations. Perform documented bench tests and independent safety review before field use. Do not open or modify an energized distribution board.
