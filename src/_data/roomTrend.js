const data = require("./data_absolut.json");
const themes = require("./colors.json");

module.exports = async function () {

  const rooms = data.filters.rooms.slice(1);

  let districtTrendData = {
  	colors: themes.continuous,
    filters: {
      rooms: rooms,
      districts: data.filters.districts
    }
  }

  let series = [];
  let series_percent = []
  let minMax = [];
  let minMax_perc = [];

  for(i=0; i < data.filters.districts.length; i++){

    let districtSeries = [];
    let districtSeries_perc = [];
    let distSeriesMaxMin = [];
    let distSeriesMaxMin_perc = [];
    
    for(j=1; j <= rooms.length; j++){
      
      let ro = {
        name: data.filters.rooms[j],
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

      let ro_perc = {
      	name: data.filters.rooms[j],
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
      }

      for(y = 0; y < data.years.length; y++){
      	ro.data.push(data.years[y].districts[i].rooms[j]);
      	ro_perc.data.push(((100 / data.years[0].districts[i].rooms[j]) * data.years[y].districts[i].rooms[j] - 100).toFixed(2))
      }

      distSeriesMaxMin = [...distSeriesMaxMin, ...ro.data];
      distSeriesMaxMin_perc = [...distSeriesMaxMin_perc, ...ro_perc.data];
      districtSeries.push(ro);
      districtSeries_perc.push(ro_perc);
      
    }

    let sorted = distSeriesMaxMin.sort((a, b) => parseFloat(a) - parseFloat(b));
    let highest = Math.ceil(sorted[distSeriesMaxMin.length - 1] / 100)*100;
    let lowest = sorted[0];

    console.log(highest);
    

    let sorted_perc = distSeriesMaxMin_perc.sort((a, b) => parseFloat(a) - parseFloat(b));
    let highest_perc = Math.ceil(sorted_perc[distSeriesMaxMin_perc.length - 1]);
    let lowest_perc = Math.floor(sorted_perc[0]);

    series.push(districtSeries);
    series_percent.push(districtSeries_perc);
    minMax.push({max: highest, min: lowest});
    minMax_perc.push({max: highest_perc, min: lowest_perc});
  
  }

  console.log(minMax);

  districtTrendData.series = series;
  districtTrendData.series_percent = series_percent;
  districtTrendData.minMax = [minMax_perc, minMax];

  return districtTrendData;
};
