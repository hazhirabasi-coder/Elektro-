#pragma once
// Copy to secrets.h locally. Never commit real credentials.
#define WIFI_SSID "REPLACE_WITH_WIFI_SSID"
#define WIFI_PASSWORD "REPLACE_WITH_WIFI_PASSWORD"
#define BOXSCAN_API_URL "https://YOUR-API-HOST.example/api/boxscan/measurements"
#define BOXSCAN_DEVICE_TOKEN "REPLACE_WITH_PER_DEVICE_TOKEN"
// Replace with the actual trusted root CA PEM for your API host.
// The placeholder will fail TLS validation, by design.
#define ROOT_CA_CERT_PEM "REPLACE_WITH_VALID_ROOT_CA_PEM"
