# Elektro Lernen – EGT Prüfungsvorbereitung

Deutsch-persische Lernhilfe für die Ausbildung **Elektroniker/in für Energie- und Gebäudetechnik**.

## Features

- Lernfelder, Formeln, Karteikarten und Quiz
- Prüfungssimulation und adaptive Wiederholung
- Lernplan und Fortschrittsspeicherung im Browser
- Responsive Oberfläche und installierbare PWA-Grundlage
- App-Shell-Caching für den Offline-Start nach dem ersten erfolgreichen Laden

## Lokal testen

Die App ist eine statische Website und benötigt keine Build-Abhängigkeiten:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Für die Offline-Funktion muss der Browser Service Worker unterstützen; auf veröffentlichten Websites ist HTTPS erforderlich.

## Qualitätssicherung

Mit Node.js 22 oder neuer:

```bash
node --test tests/*.mjs
```

GitHub Actions führt diese Smoke-Tests bei Push und Pull Request aus. Sie prüfen Struktur und Syntax, ersetzen aber keine Tests in echten Browsern, auf iPhone/Android, eine fachliche Prüfung aller Elektro-Fragen oder einen vollständigen Barrierefreiheitstest.

## Veröffentlichung auf dem iPhone / App Store

- Die GitHub-Pages-Version kann als Website bzw. PWA genutzt werden, sofern Browser und Plattform dies unterstützen.
- Eine PWA ist nicht automatisch eine native App im Apple App Store.
- Für den App Store sind zusätzliche Schritte nötig: Native Verpackung (z. B. Capacitor mit iOS-Projekt), Xcode-Build und Signierung auf einem Mac, Apple Developer Program, Datenschutzangaben und -richtlinie, App-Screenshots, Tests auf realen Geräten und App Review.
- App-Store-Freigabe ist nicht garantiert und wurde mit diesem Repository nicht beantragt.

## Hinweis zu Lerninhalten

Die App ist eine Lernhilfe. Sicherheitsrelevante elektrische Arbeiten müssen nach den geltenden Normen, betrieblichen Vorgaben und durch qualifizierte Personen geprüft werden.
