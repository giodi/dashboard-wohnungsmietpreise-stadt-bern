const data = require("./data_absolut.json");
const themes = require("./colors.json");

module.exports = async function () {

  const districts = data.filters.districts.slice(1);

  let districtTrendData = {
    colors: themes.divergent,
    filters: {
      rooms: data.filters.rooms,
      districts: districts
    }
  }

  let series = [];
  let series_percent = [];

  for(i=0; i < data.filters.rooms.length; i++){

    let roomSeries = [];
    let roomSeries_perc = [];
    
    for(j=1; j <= districts.length; j++){
      
      let dist = {
        name: data.filters.districts[j],
        type: 'line',
        animation: false,
        emphasis: {
          disabled: true,
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
        emphasis: {
          disabled: true,
        },
        lineStyle: {
          width: 4
        },
        data: []
      };

      for(y = 0; y < data.years.length; y++){
        dist.data.push(data.years[y].districts[j].rooms[i]);
        dist_perc.data.push(((100 / data.years[0].districts[j].rooms[i]) * data.years[y].districts[j].rooms[i] - 100).toFixed(2))
      }

      roomSeries.push(dist);
      roomSeries_perc.push(dist_perc);
      
    }

    series.push(roomSeries);
    series_percent.push(roomSeries_perc);
  
  }

  districtTrendData.series = series;
  districtTrendData.series_percent = series_percent;

  return districtTrendData;
};
