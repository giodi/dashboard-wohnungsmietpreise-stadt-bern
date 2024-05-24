const data = require("./data_absolut.json");
const themes = require("./colors.json");

module.exports = async function () {

	const getRooms = data.filters.rooms.slice(1);
	const rooms = getRooms.map((x) => x.substr(0,4));

	let roomPriceData = {
		colors: themes.continuous,
		filters: {
			rooms: rooms,
			districts: data.filters.districts
		},
	};

	let series = [];

	for(i = 0; i < data.years.length; i++){

		let serie = [];

		for(j = 0; j < data.years[i].districts.length; j++){

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

		    const rooms = data.years[i].districts[j].rooms.slice(1);
		    const pricePerRooms = rooms.map((room, index) => {
		    	return (room / (index + 1)).toFixed(0);
		    })

	    	item.data = pricePerRooms;
	    	serie.push(item);
	    }

	    series.push(serie);
	}

	roomPriceData.series = series;
	return roomPriceData;
};
