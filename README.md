# Dashboard Entwicklung Wohnungsmietpreise der Stadt Bern
## Einleitung
Im zweiten Teil des Frühlingssemesters 2024 haben Gionathan Diani und Martina Stüssi im Rahmen des Moduls «Dashboard Design», unterrichtet durch Dr. rer. nat Michael Burch und Dr. rer. nat Helena Jambor, ein Dashboard entwickelt. Das zugrundeliegende Mock-Up wurde im Rahmen des Kurses «Data Vizualisation» durch Lukas Streit und Gionathan Diani entwickelt. Das vorliegende Dashboard visualisiert die Mietpreise in der Stadt Bern von den Jahren 2013 bis 2023.

### Updatefrequenz 
Der Datensatz wird von der Stadt Bern jährlich veröffentlicht (jeweils im März).

### Zielpublikum 
Die Daten werden im Auftrag des Stadtberner Gemeinderates erhoben. Der Mietpreisindex ist für die Politik interessant und relevant genauso für die Bevölkerung, spezifisch in ihren Rollen als Mietende beziehungsweise Vermietende und konkret als Wohnugssuchende.

Im vorliegenden Projekt konzentrieren wir uns auf das Zielpublikum Mieterschaft. Dieses ist die breiteste der obengenannten Gruppen und besonders an der Transparenz interessiert, die dieses Dashboard bieten kann.

## Datenaufbereitung
Die verarbeiteten Daten wurden auf der Website von Statistik Stadt Bern als Excel-Dateien unter dem Stichwort [«Mietpreiserhebung»](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/publikationen#mietpreiserhebung) bezogen. Zuerst wurden die einzelnen Excel-Dateien aus Excel als CSV-Dateien exportiert und weiter mit dem Tool [csv to json](csvjson.com/csv2json) zu JSON-Daten transformiert. Mit händischer Nacharbeit wurden die einzelnen JSON-Elemente zu einer JSON-Struktur zusammengeführt und für die programmierende Weiterarbeit möglichst passend bereitgestellt. Die final verwendeten JSON-Datei ist im [Projekt-Repository](github.com/giodi/wmp-vis/tree/main/src/_data) unter `data.json` zu finden. Nachfolgend Annotationen zur Struktur des JSON:
```javascript
{
    // Die Optionen für die Filtermöglichkeiten sind im Objekt "filters" gespeichert.
    "filters" : {
        "rooms" : [...],
        ...
    },
    // Der Inhalt im Array "years" korrspondiert mit den Daten
    // aus der XLS-Datei vom Open Government Portal.
    // Jedes Tabellenblatt entspricht einem Eintrag im Array.
    "years":[
        {
            "year": 2013,
            // Array mit Objekt pro Stadtteil
            "districts": [
                {    
                    // Bezeichnung Stadtteil
                    "district" : "all",
                    // rooms enthält die Wohnungsmietpreise
                    // rooms[0] = Durchschnittlicher Wohnungsmietpreis
                    // rooms[5] = Mietpreis für 5-Zimmer Wohnung
                    "rooms": [1155, 663, 949, 1151, 1472, 1874]
                },
               ...
            ]
        }
        ...
    ]
}
```

## Technische Umsetzung
Das Dashboard wurde mithilfe des [Static Site Generators](https://en.wikipedia.org/wiki/Static_site_generator) «[11ty](https://11ty.dev)» und der Visualisierungsprogrammbibliothek «[Apache ECharts](https://echarts.apache.org/)» erstellt. 11ty erlaubt eine sehr flexible Strukturierung von Projekten, weshalb anschliessend Erläuterungen zur Verzeichnisstruktur und einzelner Dateien erfolgt. Im Programmquellcode sind zudem weitere Kommentare zum Code angebracht. Die Erklärungen beschränken sich auf die für die Umsetzung des Dashboards wichtigen Bestandteile. Für weitere grundsätzliche Erklärungen an dieser Stelle ein Verweis auf die Dokumentation von [11ty](https://www.11ty.dev/docs/) und [Apache ECharts](https://echarts.apache.org/handbook/en/get-started/).

### .eleventy.js
Die [Konfigurationsdatei](https://www.11ty.dev/docs/config/) `.eleventy.js` dient zur Steuerung des Verhaltens und bietet die Möglichkeit 11ty um Funktionen zu erweitern.

### src
Das Verzeichnis `src` enthält alle Quelldateien, welche 11ty zur Kompilierung der Ausgabe verwendet.

#### src/_data
Im Verzeichnis _data befinden sich Dateien, welche in 11ty «[Global Data Files](https://www.11ty.dev/docs/data-global/)» genannt werden. 

- `data.json`: Entspricht dem Datensatz «T 05.03.050i Durchschnittliche Monatsmietpreise nach Wohnungsgrösse im November 2022 – Stadtteile» als JSON aufbereitet. 
- `colors.json`: Enthält die Farbschemen, für die Diagramme. 
- `mapData.js`: Zusammenstellung der für die Choroplethenkarte benötigte Diagramm, anhand der Dateien `data.json` und `colors.json`.
- `pricePerRoom.js`: Zusammenstellung der für das Balkendiagramm «Preis pro Zimmer» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.
- `roomPrice.js`: Zusammenstellung der für das Balkendiagramm «Preis pro Zimmer» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.
- `trendDistrict.js`: Zusammenstellung der für das Liniendiagramm «Stadtteil» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.
- `trendRoom.js`: Zusammenstellung der für das Liniendiagramm «Wohnungsgrösse» benötigten Daten, anhand der Dateien `data.json` und `colors.json`.

#### src/_includes
Das Verzeichnis `_includes` enthält alle [Templates](https://www.11ty.dev/docs/templates/). Das bedeutet, hier befindet sich der Hauptteil des Programmcodes, aus welchem das Dashboard besteht (HTML, CSS, JS). Als Templatingsprache kommt zudem [Nunjucks](https://mozilla.github.io/nunjucks/) zum Einsatz.

- `base.njk`: Enthält das HTML [Grundgerüst](https://wiki.selfhtml.org/wiki/HTML/Tutorials/Grundger%C3%BCst), welches um Metadaten für Link-Previews angereichert wurde.
-  `checkboxes.njk` und `select.njk`: Layouts zum Generieren der Auswahlfelder und Auswahllisten bei den Diagrammen.
- `style.css`, `style_mobile.css` und `inter.css`: Stylesheet zur Steuerung des Aussehens des Dashboards.
- `karte.svg`: Enthält die Vektordaten für die Choroplethenkarte.
- `popover.min.js`: Polyfill für das HTML-Attribut «popover» von [oddbird](https://github.com/oddbird/popover-polyfill).
- `dashboard.js`: Programmcode, verantwortlich für die Visualisierungen und Bedienelemente.

### assets
Das Verzeichnis enthält alle statischen Dateien, welche für das Dashboard benötigt werden, wie bspw. die Schrift «Inter», die «Apache ECharts» Programmbibliothek oder Bilder.

### docs
Das Verzeichnis `docs` enthält das kompilierte Projekt und dient der Veröffentlichung des Dashboards über [GitHub Pages](https://pages.github.com/).

### Projektstruktur
11ty erlaubt eine sehr flexible Strukturierung eines Projekts. Nachfolgend Erläuterungen zur Verzeichnisstruktur und einzelner Dateien. Im Programmquellcode sind zudem weitere Kommentare zum Code angebracht. Die Erklärungen beschränken sich auf für die Umsetzung des Dashboards wichtigen Bestandteile. Für weitere grundsätzliche Erklärungen an dieser Stelle ein Verweis auf die Dokumentation von 11ty und Apache ECharts.


## Quellen
- [Über die Wohnungsmietpreiserhebung](https://www.bern.ch/politik-und-verwaltung/stadtverwaltung/prd/abteilung-aussenbeziehungen-und-statistik/statistik-stadt-bern/wohnungsmietpreiserhebung)
- [Open Government Data Stadt Bern](https://www.bern.ch/open-government-data-ogd/ideen-fuer-dienstleistungen)
- [Index der Wohnungsmietpreise der Stadt Bern](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/05pre/05pre-xls#mietpreise)
- [Überblick Stadtteile der Stadt Bern](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/stasta)
