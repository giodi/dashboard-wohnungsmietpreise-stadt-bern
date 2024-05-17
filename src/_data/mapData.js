const data = require("./data_absolut.json");
const themes = require("./colors.json");

module.exports = async function () {

	const getDistricts = data.filters.districts.slice(1);

	let mapData = {
		colors: themes.continuous,
		filters: {
			rooms: data.filters.rooms,
		}
	}

	let dataYear = [];

	for(i = 0; i < data.years.length; i++){

		let dataRooms = [];

		for(j = 0; j < data.filters.rooms.length; j++){

			let series = {
				type: 'map',
				map: 'stadtteile',
		        name: data.years[i].year,
	            data: []
		    }

			let roomPrices = []

			for(k = 1; k < data.filters.districts.length; k++){
				
				roomPrices.push({
					district: k, 
					price: data.years[i].districts[k].rooms[j]
				});
				
				series.data.push({
					name: data.filters.districts[k],
					value: data.years[i].districts[k].rooms[j]
				})
			}

			let sorted = roomPrices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
			let highest = sorted[roomPrices.length - 1]
			let lowest = sorted[0];
			let difference = (Math.abs(highest.price - lowest.price) / ((highest.price + lowest.price) / 2)) * 100;

			let textVars = [data.filters.districts[lowest.district],lowest.price,data.filters.districts[highest.district], highest.price, difference.toFixed(2)];

			let visualMap = {
				min: lowest.price,
				max: highest.price,
				text: [highest.price, lowest.price],
				inRange: {
					color: themes.continuous
				}
			}

			dataRooms.push([{visualMap, series}, textVars]);
	    }

	    dataYear.push(dataRooms);
	}

	return dataYear;

};
