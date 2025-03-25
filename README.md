Bericht von Gionathan Diani und Martina Stüssi, 30.06.2024  
Dashboard Design, Fachhochschule Graubünden

# Dashboard Entwicklung Wohnungsmietpreise der Stadt Bern
* Link zum Dashboard: https://giodi.github.io/dashboard-wohnungsmietpreise-stadt-bern/
* Link zum Repository: https://github.com/dashboard-wohnungsmietpreise-stadt-bern/
## Einleitung
Wohnungswesen und im Besonderen Mietverhältnisse sind hitzig diskutierte Themen, dies zeigt ein Blick in die Geschäftsdatenbanken der Bundesversammlung und des Berner Stadtparlaments. Darin sind eine Reihe hängiger Geschäfte, mit einschlägigen Titeln wie «Mietzinserhöhung trifft Mieter vierfach. Evaluation der rechtlichen Grundlage für Mietzinserhöhungen» ([Gugger, 2023](https://www.parlament.ch/de/ratsbetrieb/suche-curia-vista/geschaeft?AffairId=20234272)) oder «Für eine soziale Wohnungspolitik – Mietzinsdeckel statt Luxussanierungen» ([Micieli & Joggi, 2024](https://ris.bern.ch/Geschaeft.aspx?obj_guid=cb53a21b596b4e6a8b871825423ecb89)), aufzufinden. Vor diesem Hintergrund wurde ein Dashboard zur Exploration der Stadtberner Wohnungsmietpreise entwickelt. Das Dashboard erlaubt einen Überblick über die Entwicklung der Wohnungsmietpreise von 2013 bis 2023 und ermöglicht eine Segmentierung nach den Merkmalen Jahr, Wohnungsgrösse und Stadtteil. 

Die Entwicklung der Wohnungsmietpreise ist für die Politik interessant und relevant genauso wie für die Bevölkerung und spezifisch in ihren Rollen als Mietende beziehungsweise Vermietende und konkret als Wohnugssuchende. Im vorliegenden Projekt konzentrieren wir uns auf das Zielpublikum Mieterschaft. Dieses ist die breiteste der genannten Gruppen und besonders an der Transparenz interessiert, die dieses Dashboard bieten kann.

## Daten
### Datengrundlage
Als Datengrundlage dient der Datensatz «[T 05.03.050i Durchschnittliche Monatsmietpreise nach Wohnungsgrösse im November 2022 – Stadtteile](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/05pre/05pre-xls#mietpreise)». Dieser schlüsselt [die durchschnittlichen Wohnungsmonatsmietpreise](https://www.bern.ch/politik-und-verwaltung/stadtverwaltung/prd/abteilung-aussenbeziehungen-und-statistik/statistik-stadt-bern/wohnungsmietpreiserhebung) (WMP) der Stadt Bern von 2010 bis 2023, nach Wohnungsgrösse und Stadtteil auf. Er wird über das «[Open Government Data](https://www.bern.ch/open-government-data-ogd/ideen-fuer-dienstleistungen)»-Portal der Stadt Bern im Microsoft Excel Dateiformat bereitgestellt. Die Daten werden jährlich im November erhoben und der aktualisierte Datensatz wird im darauffolgenden März veröffentlicht. Die Erhebung der Mietpreise erfolgt im Auftrag des Stadtberner Gemeinderats und dient der Schaffung von Transparenz auf dem Immobilienmarkt, was gleichermassen dem Interesse von Politik, Mietparteien und Vermieter:innen dient. 

Die Excel-Datei «T 05.03.050i» enthält pro Erhebungsjahr ein separates Tabellenblatt. Jedes Tabellenblatt enthält Angaben zu durchschnittlichen Monatsmietpreisen nach Wohnungsgrösse (von eins bis fünf Zimmern und ab 2013 mit Angaben über alle Wohnungsgrössen hinweg) und Quartier (Längasse-Felsenau, Mattenhof-Weissenbühl, Kirchenfeld-Schosshalde, Breitenrain-Lorraine, Bümpliz-Oberbottigen und stadtweit [Stadt Bern]). 

Zur visuellen Darstellung der Stadtteile der Stadt Bern wurde folgender [Überblick Stadtteile der Stadt Bern](https://www.bern.ch/themen/stadt-recht-und-politik/bern-in-zahlen/katost/stasta) verwendet.

### Datenaufbereitung
Der Datensatz erforderte eine zusätzliche Aufbereitung, aufgrund festgestellter Inkonsistenzen und der für die maschinelle Verarbeitung ungeeigneten Form. Erst ab dem Jahr 2013 existiert eine zusätzliche Spalte «Insgesamt», welche per 2015 zu «Total» umbenannt wurde. Darin enthalten ist «das mit dem Wohnungsbestand gewichtete Mittel» pro Stadtteil, wobei die Wohnungsbestände als separater Datensatz erhältlich sind. Um den Verhältniswert Kosten pro Zimmer darzustellen, musste dieser zusätzlich errechnet werden. Da fehlenden Informationen zu «Total» beziehungsweise «Insgesamt» nicht errechnet werden konnten, klammert das vorliegende Dashboard die Jahre 2010 - 2012 aus.

Um die Daten weiterverarbeiten zu können wurden sie aus den Excel-Tabellenblättern als CSV-Dateien exportiert und mit dem Tool [csv to json](csvjson.com/csv2json) zu JSON-Daten transformiert. Mit händischer Nacharbeit wurden die JSON-Elemente zu einer JSON-Struktur zusammengeführt und für die programmierende Weiterarbeit möglichst passend bereitgestellt. Die gewählte Struktur des JSON-Objekts orientiert sich an der zu grundeliegenden Excel-Datei. Dabei wurden die Tabellentitel (Wohnungsgrössen in Zimmeranzahl) und Spaltentitel (Quartiernamen und Stadt Bern) herausgelöst und je in einem Array dargestellt, so können Wiederholungen vermieden werden. Die Daten wurden nach Jahr «year» und nach Quartier «districts» geordnet. Innerhalb der Quartiere finden sich die Angaben zu Kosten nach Zimmergrössen und wohnungsübergreifenden Kosten.

Die final verwendeten JSON-Datei ist im [Projekt-Repository](github.com/giodi/wmp-vis/tree/main/src/_data) unter `data.json` zu finden. Nachfolgend Annotationen zur Struktur des JSON:
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
                    // rooms[1-5] = Mietpreis für 1- bis 5-Zimmer Wohnung
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
- `colors.json`: Enthält die Farbschemen für die Diagramme. 
- `mapData.js`: Zusammenstellung der für die Choroplethenkarte benötigten Diagramme, anhand der Dateien `data.json` und `colors.json`.
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
Das Verzeichnis `assets` enthält alle statischen Dateien, welche für das Dashboard benötigt werden, wie bspw. die Schrift «Inter», die «Apache ECharts» Programmbibliothek oder Bilder.

### docs
Das Verzeichnis `docs` enthält das kompilierte Projekt und dient der Veröffentlichung des Dashboards über [GitHub Pages](https://pages.github.com/).

## Mögliche Weiterentwicklung

Eine Erweiterung des Dashboards auf Wohnungsmietpreisangaben aus anderen Städten der Schweiz wäre grundsätzlich denkbar. Grundlegende Abklärungen in die Datenlage haben aber ergeben, dass die Datenlage der Stadt Bern im Vergleich zu anderen Städten sehr reichhaltig ist. Bei einer Anpassung auf einen andere Stadt müsste man auf viele Daten verzichten. 

Exemplarisch sei die Situation an zwei Beispielen gezeigt:
- Die [Stadt Zürich](https://www.stadt-zuerich.ch/prd/de/index/statistik/publikationen-angebote/publikationen/webartikel/2022-11-03_Mietpreise-in-der-Stadt-Zuerich.html) hat einzig 2022 eine Mietpreiserhebung durchgeführt, davor wurde die letzte Mietpreiserhebung 2006 durchgeführt, bei dieser Datensituation macht eine jährliche Darstellung keinen Sinn.
- Der Stadt-Kanton [Basel-Stadt](https://www.statistik.bs.ch/zahlen/tabellen/9-bau-wohnungswesen/mietpreise.html) erhebt die Mietpreise zwar regelmässig und stellt eine breite Palette an Daten zur Mietsituation bereit, diese sind trotzdem anders strukturiert als die Berner Daten. So gibt es im Datensatz «T09.3.11 - nach Zimmerzahl und Bauperiode» jährliche Daten nach Zimmerzahl und Jahr, der Datensatz «T09.3.21 - nach Zimmerzahl und Wohnviertel» mit geografisch lokalisierten Daten zu Zimmerzahl und Jahr wird aber nur in Vierjahresperioden (2010-2014, 2018-2022) und mit Lücken publiziert.

Möglicherweise vergleichbar sind einzig die Daten des Kantons Genf im Datensatz «[T 05.04.2.01 - Loyer mensuel moyen selon le nombre de pièces et diverses caractéristiques, depuis 2006](https://statistique.ge.ch/domaines/05/05_04/tableaux.asp#5)» mit Angaben zu Quartier, Jahr und Anzahl der Zimmer.
