# Dashboard Entwicklung Wohnungsmietpreise der Stadt Bern

## Technische Umsetzung
Das Dashboard wurde mithilfe des [Static Site Generators](https://en.wikipedia.org/wiki/Static_site_generator) «[11ty](https://11ty.dev)» und der Visualisierungsprogrammbibliothek «[Apache ECharts](https://echarts.apache.org/)» erstellt.

### Projektstruktur
11ty erlaubt eine sehr flexible Strukturierung eines Projekts. Nachfolgend Erläuterungen zur Verzeichnisstruktur und einzelner Dateien. Im Programmquellcode sind zudem weitere Kommentare zum Code angebracht. Die Erklärungen beschränken sich auf für die Umsetzung des Dashboards wichtigen Bestandteile. Für weitere grundsätzliche Erklärungen an dieser Stelle ein Verweis auf die Dokumentation von 11ty und Apache ECharts.

#### .eleventy.js
Die [Konfigurationsdatei](https://www.11ty.dev/docs/config/) `.eleventy.js` dient zur Steuerung des Verhaltens und bietet die Möglichkeit 11ty um Funktionen zu erweitern.

#### src
Das Verzeichnis `src` enthält alle Quelldateien, welche 11ty zur Kompilierung der Ausgabe verwendet.

##### src/_data
Im Verzeichnis _data befinden sich Dateien, welche in 11ty «[Global Data Files](https://www.11ty.dev/docs/data-global/)» genannt werden.
-   `data.json`: Entspricht dem Datensatz «T 05.03.050i Durchschnittliche Monatsmietpreise nach Wohnungsgrösse im November 2022 – Stadtteile» als JSON aufbereitet.
-   `colors.json`: Enthält die Farbschemen, für die Diagramme.
-   `mapData.js`: Zusammenstellung der für die Choroplethenkarte benötigte Diagramm, anhand der Dateien `data.json` und `colors.json`.
-   `pricePerRoom.js`: Zusammenstellung der für das Balkendiagramm «Preis pro Zimmer» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.
-   `roomPrice.js`: Zusammenstellung der für das Balkendiagramm «Preis pro Zimmer» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.
-   `trendDistrict.js`: Zusammenstellung der für das Liniendiagramm «Stadtteil» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.
-   `trendRoom.js`: Zusammenstellung der für das Liniendiagramm «Wohnungsgrösse» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.

##### src/_includes
Das Verzeichnis `_includes` enthält alle [Templates]([https://www.11ty.dev/docs/templates/](https://www.11ty.dev/docs/templates/)). Das bedeutet, hier befindet sich der Hauptteil des Programmcodes, aus welchem das Dashboard besteht (HTML, CSS, JS). Als Templatingsprache kommt zudem [Nunjucks](https://mozilla.github.io/nunjucks/) zum Einsatz.
-   `base.njk`: Enthält das HTML [Grundgerüst]([https://wiki.selfhtml.org/wiki/HTML/Tutorials/Grundger%C3%BCst](https://wiki.selfhtml.org/wiki/HTML/Tutorials/Grundger%C3%BCst)), welches um Metadaten für Link-Previews angereichert wurde.
    
-   `checkboxes.njk` und `select.njk`: Layouts zum Generieren der Auswahlfelder und Auswahllisten bei den Diagrammen.
-   `style.css`, `style_mobile.css` und `inter.css`: Stylesheet zur Steuerung des Aussehens des Dashboards.
-   `karte.svg`: Enthält die Vektordaten für die Choroplethenkarte.
-   `popover.min.js`: Polyfill für das HTML-Attribut «popover» von [oddbird]([https://github.com/oddbird/popover-polyfill](https://github.com/oddbird/popover-polyfill)).
-   `dashboard.js`: Programmcode, verantwortlich für die Visualisierungen und Bedienelemente.

#### assets
Das Verzeichnis enthält alle statischen Dateien welche für das Dashboard benötigt werden wie bspw. die Schrift «Inter», die Apache ECharts Programmbibliothek oder Bilder.

### docs
Das Verzeichnis `docs` enthält das kompilierte Projekt und ist einzig im Repository vorhanden, um es über GitHub Pages zur Verfügung stellen zu können.

## Updatefrequenz 
- jährlich (jeweils im März)

## Zielpublikum 
- Auftrag des Stadtberner Gemeinderates
- Der Mietpreisindex ist für die Politik interessant und relevant
- Genauso für die Bevölkerung, spezifisch in ihren Rollen als Mietende beziehungsweise Vermietende.
- Konkret auch Wohnugssuchende

Im vorliegenden Projekt konzentrieren wir uns auf das Zielpublikum Mieterschaft. Diese sind die breiteste der obengenannten Gruppen ist und besonders an Transparenz interessiert, die dieses Dashboard bieten kann.


## Verwendete Tools

[csv2json](https://csvjson.com/csv2json)

## Quellen
- [Über die Wohnungsmietpreiserhebung](https://www.bern.ch/politik-und-verwaltung/stadtverwaltung/prd/abteilung-aussenbeziehungen-und-statistik/statistik-stadt-bern/wohnungsmietpreiserhebung)
- [Open Government Data Stadt Bern](https://www.bern.ch/open-government-data-ogd/ideen-fuer-dienstleistungen)
- [Index der Wohnungsmietpreise der Stadt Bern](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/05pre/05pre-xls#mietpreise)
- [Überblick Stadtteile der Stadt Bern](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/stasta)
