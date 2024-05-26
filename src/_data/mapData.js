const data = require("./data.json");
const colorThemes = require("./colors.json");

module.exports = async function () {

	// Lese vorhandene Stadtteile aus (ohne Eintrag alle Stadtteile)
	const districts = data.filters.districts.slice(1);

	// Objekt für Ausgabe
	let mapData = {
		colors: colorThemes.continuous,
		filters: {
			rooms: data.filters.rooms,
		}
	}

	// Loop für die Zusammenstellung der Daten
	let dataYear = [];

	// Iteration erste Ebene (Jahre)
	for(const [indexYear, year] of data.years.entries()){

		let dataRooms = [];

		// Iteration zweite Ebene (Zimmergrössen)
		for(const indexRoom of data.filters.rooms.keys()){

			let series = {
				type: 'map',
				map: 'stadtteile',
		        name: year.year,
	            data: []
		    }

		    let roomPrices = []

		    for(const indexDistrict of districts.keys()){

		    	roomPrices.push({
		    		district: indexDistrict + 1,
		    		price: year.districts[indexDistrict + 1].rooms[indexRoom]
		    	});

		    	series.data.push({
					name: data.filters.districts[indexDistrict + 1],
					value: year.districts[indexDistrict + 1].rooms[indexRoom]
				})
		    }

		    // Berechne Differenz zwischen teuerstem und günstigstem Stadtteil
		    let sorted = roomPrices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
			let highest = sorted[roomPrices.length - 1]
			let lowest = sorted[0];
			let difference = (Math.abs(highest.price - lowest.price) / ((highest.price + lowest.price) / 2)) * 100;

			// Daten für Fliesstext
			let textVars = [data.filters.districts[lowest.district],lowest.price.toLocaleString('de-CH'),data.filters.districts[highest.district], highest.price.toLocaleString('de-CH'), difference.toFixed(2).toLocaleString('de-CH')];

			let visualMap = {
				min: lowest.price,
				max: highest.price,
				text: [highest.price.toLocaleString('de-CH'), lowest.price.toLocaleString('de-CH')],
				inRange: {
					color: colorThemes.continuous
				}
			}

			
			dataRooms.push([{visualMap, series}, textVars]);
		}

		dataYear.push(dataRooms);
	}

	return dataYear;

};
