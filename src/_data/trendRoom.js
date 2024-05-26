const data = require("./data.json");
const colorThemes = require("./colors.json");

function getMinMax(list){
  
  let sortedList = list.sort((a, b) => parseFloat(a) - parseFloat(b));
  let max = sortedList[list.length - 1];
  let min = sortedList[0];
  
  return {min: min, max: max};
}

module.exports = async function () {

  // Lese vorhandene Zimmergrössen aus (ohne Eintrag alle Zimmergrössen)
  const rooms = data.filters.rooms.slice(1);

  // Objekt für Ausgabe
  let roomTrendData = {
  	colors: colorThemes.continuous,
    filters: {
      rooms: rooms,
      districts: data.filters.districts
    }
  }

  // Loop für die Zusammenstellung der Daten
  let series = [];
  let seriesPercent = []
  let minMax = [];
  let minMaxPercent = [];

  // Iteration erste Ebene (Stadtteile)
  for(const indexDistrict of data.filters.districts.keys()){

    let seriesDistrict = [];
    let seriesDistrictPercent = [];
    let seriesMinMax = [];
    let seriesMinMaxPercent = [];

    // Iteration zweite Ebene (Zimmergrössen ohne "Alle Zimmergrössen")
    for(const [indexRoomSize, valueRoomSize] of rooms.entries()){
      
      // Erstelle Objekt mit Optionen für Diagramm
      let roomItem = {
        type: 'line',
        name: valueRoomSize,
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
      let roomItemPercent = structuredClone(roomItem);

      // Iteration dritte Ebene (Jahre)
      for(const year of data.years){
        roomItem.data.push(year.districts[indexDistrict].rooms[indexRoomSize + 1]);
        roomItemPercent.data.push(((100 / data.years[0].districts[indexDistrict].rooms[indexRoomSize + 1]) * year.districts[indexDistrict].rooms[indexRoomSize + 1] - 100).toFixed(2));
      }

      seriesDistrict.push(roomItem);
      seriesDistrictPercent.push(roomItemPercent);
      seriesMinMax = [...seriesMinMax, ...roomItem.data];
      seriesMinMaxPercent = [...seriesMinMaxPercent, ...roomItemPercent.data];

    }

    series.push(seriesDistrict);
    seriesPercent.push(seriesDistrictPercent);
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
  roomTrendData.series = series;
  roomTrendData.seriesPercent = seriesPercent;
  roomTrendData.minMax = [minMaxPercent, minMax];

  return roomTrendData;
};
