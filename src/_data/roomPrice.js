const data = require("./data_absolut.json");
const colorThemes = require("./colors.json");

module.exports = async function () {

	// Lese vorhandene Zimmergrössen aus (ohne Eintrag "alle Zimmergrössen")
	const roomSizes = data.filters.rooms.slice(1);
	const roomsSizesLabel = roomSizes.map((x) => x.substr(0,4));

	// Objekt für Ausgabe
	let roomPriceData = {
		colors: colorThemes.continuous,
		filters: {
			rooms: roomsSizesLabel,
			districts: data.filters.districts
		},
	};

	// Loop für die Zusammenstellung der Daten
	let series = [];

	// Iteration erste Ebene (Jahre)
	for(const [indexYear, year] of data.years.entries()){

		let seriesDistrict = [];

		// Iteration zweite Ebene (Stadtteile)
		for(const indexDistrict of year.districts.keys()){

			let item = {
		    	type: 'bar',
		    	animation: false,
		    	label: {
		    		show: true,
		    		fontWeight: '700',
		    		position: 'right',
		    		color: '#000'
		    	}
		    }

		    item.data = data.years[indexYear].districts[indexDistrict].rooms.slice(1);
			seriesDistrict.push(item);
		}

		series.push(seriesDistrict)
	}

	roomPriceData.series = series
	return roomPriceData;
};
