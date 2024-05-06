const data = require("./data_neu.json");

module.exports = async function () {

  let series = [];

  Object.entries(data.filters.rooms).forEach(([kR, r]) => {

    let roomSeries = [];

    Object.entries(data.years[0].districts).forEach(([kD, d]) => {

      let dist = {
        name: data.filters.districts[kD],
        type: 'line',
        lineStyle: {
          width: 4
        },
        data: []
      };

      data.years.forEach((d) => {
        dist.data.push(d.districts[kD].rooms[kR]);
      });

      roomSeries.push(dist)

    });

    series.push(roomSeries);

  });

  return series;
};
