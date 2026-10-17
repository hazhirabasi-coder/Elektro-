# Lerninhalte – Elektro Lernen

Dieser Ordner enthält strukturierte Lerninhalte, getrennt von der Benutzeroberfläche.

## Lernfeld 1

`lernfeld-01.json` ist die erste zweisprachige Inhaltsvorlage (Deutsch/Persisch). Sie enthält:

- Lernziele und Sicherheitshinweise
- fünf Lernmodule mit Erklärungen, Formeln und Beispielen
- zehn Verständnisfragen mit Lösungen und Erklärungen
- Fachwortschatz Deutsch–Persisch
- drei zusätzliche Prüfungsaufgaben mit Rechenweg
- Checkliste zum selbstständigen Lernfortschritt
- Links zu offiziellen Referenzquellen

## Lernfeld 2

`lernfeld-02.json` ergänzt die App um vier zweisprachige Module zu Auftragsplanung, Schalt- und Installationsplänen, Leitungsauswahl sowie Prüfung und Dokumentation. Enthalten sind acht Verständnisfragen, drei Prüfungsaufgaben und zehn Fachbegriffe. Das Lernfeld ist in der Navigation unter dem zweiten Lernfeld aufrufbar.

## Datenstruktur

- `schemaVersion`: Version des Datenformats
- `id`: eindeutige Lernfeldkennung
- `title`, `objectives`, `lessons`: Inhalte jeweils mit `de` und `fa`
- `lessons[].checks[].answer`: nullbasierter Index der richtigen Antwort
- `lessons[].checks[].why`: Begründung in beiden Sprachen
- `examTasks`: zusätzliche Rechenaufgaben mit Lösung
- `glossary`: Fachbegriffe Deutsch–Persisch

## Integration

Die vorhandene Anwendung ist derzeit überwiegend in `index.html` enthalten. Dieses JSON ist zunächst eine Inhaltsquelle und wird nicht automatisch in der bestehenden Oberfläche geladen. Der nächste Integrationsschritt sollte einen kleinen Loader und eine sichere Darstellung von Texten/Antworten ergänzen, ohne bestehende Funktionen zu entfernen.

## Fachliche Hinweise

Das Material dient der Prüfungsvorbereitung und ist kein Ersatz für aktuelle Normen, Herstellerangaben, betriebliche Anweisungen oder die erforderliche Qualifikation. Vor der Veröffentlichung sollten Formeln, Übersetzungen und Prüfungsbezüge fachlich gegengeprüft werden.

Offizielle Referenzen:
- https://www.gesetze-im-internet.de/elekausbv_2021/
- https://www.kmk.org/themen/berufliche-schulen/duale-berufsausbildung/rahmenlehrplaene-fuer-die-berufsschule.html
