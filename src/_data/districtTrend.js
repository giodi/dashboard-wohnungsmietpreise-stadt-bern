const data = require("./data_absolut.json");
const themes = require("./colors.json");

// Zusammenstellung der Daten für Preisentwicklung Stadtteile (Liniendiagram)

module.exports = async function () {

  // Array mit Stadtteilen
  const districts = data.filters.districts.slice(1);

  // Objekt mit Optionen für Echarts
  let districtTrendData = {
    colors: themes.divergent,
    filters: {
      rooms: data.filters.rooms,
      districts: districts
    },
  }

  // Zusammenstellung der Daten / Optionen für die Liniendiagram
  let series = [];
  let series_percent = [];
  let minMax = [];
  let minMax_perc = [];

  for(i=0; i < data.filters.rooms.length; i++){

    let roomSeries = [];
    let roomSeries_perc = [];
    let roomSeriesMaxMin = [];
    let roomSeriesMaxMin_perc = [];
    
    
    for(j=1; j <= districts.length; j++){
      
      let dist = {
        name: data.filters.districts[j],
        type: 'line',
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

      let dist_perc = {
        name: data.filters.districts[j],
        type: 'line',
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

      for(y = 0; y < data.years.length; y++){
        dist.data.push(data.years[y].districts[j].rooms[i]);
        dist_perc.data.push(((100 / data.years[0].districts[j].rooms[i]) * data.years[y].districts[j].rooms[i] - 100).toFixed(2));
      }

      roomSeriesMaxMin = [...roomSeriesMaxMin, ...dist.data];
      roomSeriesMaxMin_perc = [...roomSeriesMaxMin_perc, ...dist_perc.data];
      roomSeries.push(dist);
      roomSeries_perc.push(dist_perc);
      
    }
    
    let sorted = roomSeriesMaxMin.sort((a, b) => parseFloat(a) - parseFloat(b));
    let highest = Math.ceil(sorted[roomSeriesMaxMin.length - 1] / 100)*100;
    let lowest = sorted[0];

    let sorted_perc = roomSeriesMaxMin_perc.sort((a, b) => parseFloat(a) - parseFloat(b));
    let highest_perc = Math.ceil(sorted_perc[roomSeriesMaxMin_perc.length - 1]);
    let lowest_perc = Math.floor(sorted_perc[0]);
    
    series.push(roomSeries);
    series_percent.push(roomSeries_perc);
    minMax.push({max: highest, min: lowest});
    minMax_perc.push({max: highest_perc, min: lowest_perc});
    
  }

  districtTrendData.series = series;
  districtTrendData.series_percent = series_percent;
  districtTrendData.minMax = [minMax_perc, minMax];

  return districtTrendData;
};
