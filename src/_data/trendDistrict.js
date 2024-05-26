const data = require("./data.json");
const colorThemes = require("./colors.json");

function getMinMax(list){
  
  let sortedList = list.sort((a, b) => parseFloat(a) - parseFloat(b));
  let max = sortedList[list.length - 1];
  let min = sortedList[0];
  
  return {min: min, max: max};
}

module.exports = async function () {

  // Lese vorhandene Stadtteile aus (ohne Eintrag alle Stadtteile)
  const districts = data.filters.districts.slice(1);

  // Objekt für Ausgabe
  let districtTrendData = {
  	colors: colorThemes.continuous,
    filters: {
      rooms: data.filters.rooms,
      districts: districts
    }
  }

  // Loop für die Zusammenstellung der Daten
  let series = [];
  let seriesPercent = []
  let minMax = [];
  let minMaxPercent = [];

  // Iteration erste Ebene (Zimmergrössen)
  for(const indexRoomSize of data.filters.rooms.keys()){

    let seriesRoom = [];
    let seriesRoomPercent = [];
    let seriesMinMax = [];
    let seriesMinMaxPercent = [];

    // Iteration zweite Ebene (Stadtteile)
    for(const [indexDistrict, valueDistrict] of districts.entries()){
      
      // Erstelle Objekt mit Optionen für Diagramm
      let districtItem = {
        type: 'line',
        name: valueDistrict,
        animation: false,
        symbol: 'circle',
        symbolSize: 13,
        itemStyle: {
          opacity: 0,
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        lineStyle: {
          width: 4
        },
        data: []
      };

      // Klone Objekt für prozentuale Angaben
      let districtItemPercent = structuredClone(districtItem);

      // Iteration dritte Ebene (Jahre)
      for(const year of data.years){
        districtItem.data.push(year.districts[indexDistrict + 1].rooms[indexRoomSize]);
        districtItemPercent.data.push(((100 / data.years[0].districts[indexDistrict + 1].rooms[indexRoomSize]) * year.districts[indexDistrict + 1].rooms[indexRoomSize] - 100).toFixed(2));
      }

      seriesRoom.push(districtItem);
      seriesRoomPercent.push(districtItemPercent);
      seriesMinMax = [...seriesMinMax, ...districtItem.data];
      seriesMinMaxPercent = [...seriesMinMaxPercent, ...districtItemPercent.data];

    }

    series.push(seriesRoom);
    seriesPercent.push(seriesRoomPercent);
    minMax.push(getMinMax(seriesMinMax));
    minMaxPercent.push(getMinMax(seriesMinMaxPercent));

  }

  // Runde min / max, ab und auf
  minMax.forEach((item) => {
    item.min = item.min - 50; 
    item.max = Math.ceil(item.max / 100) * 100;
  })

  minMaxPercent.forEach((item) => {
    item.min = Math.floor(item.min); 
    item.max = Math.ceil(item.max);
  })

  // Zusammenfügen aller Daten
  districtTrendData.series = series;
  districtTrendData.seriesPercent = seriesPercent;
  districtTrendData.minMax = [minMaxPercent, minMax];

  return districtTrendData;
};
