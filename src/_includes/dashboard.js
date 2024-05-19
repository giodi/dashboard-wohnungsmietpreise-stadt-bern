(()=>{
const commonChartOptions = {
	basis: {
		animation: false,
		grid: {
			left: 0,
			right: 0,
			top: 10,
			bottom: 0,
			containLabel: true,
		},
		tooltip: {
			show: true,
			trigger: 'item',
			backgroundColor: "#575757",
			borderColor: "#575757",
			formatter: '{a}<br>{b}<br>{c}',
			textStyle: {
				color: '#fff',
			},
			axisPointer: {
				type: 'line',
				snap: true
			}
		}
	},
	trendAxis: {
		xAxis: {
			name: 'Jahr',
			nameLocation: 'end',
			nameGap: 0,
			nameRotate: 0,
			nameTextStyle: {
				align: 'right',
				verticalAlign: 'bottom',
				padding: [0, 0, 10, 0]
			},
			type: 'category',
			data: [{% for year in data_absolut.years %}{{ year.year }},{% endfor %}],
		  	onZero: false,
		  	axisTick: {
		  		alignWithLabel: true,
		  	},
		  	axisLine: {
		  		onZero: false,
		    	show: true,
		      	lineStyle: {
		      		color: '#575757'
		    	},
		    },
		    axisLabel: {
		    	fontSize: 14, 
		    	fontFamily: 'Inter, sans-serif',
		    },
		},
		yAxis: {
		  	nameLocation: 'end',
		  	nameGap: 0,
		  	nameRotate: 0,
		  	nameTextStyle: {
				align: 'left',
		 		verticalAlign: 'top',
				padding: [0, 0, 0, 10]
			},
			type: 'value',
			scale: true,
			axisTick: {
			   	show: true,
			   	alignWithLabel: true,
			},
			splitLine: {
			    show: false
			},
			axisLine: {
		    	show: true,
		      	lineStyle: {
		      		color: '#575757'
		    	},
		    },
		    axisLabel: {
		    	fontSize: 14, 
		    	fontFamily: 'Inter, sans-serif',
		    	formatter: (val) => {return val.toLocaleString('de-CH')},
		    },
		},
	}
}

const dashboard = {
	data: {
		trendDistrict: [{{ districtTrend.series_percent | dump | safe }}, {{ districtTrend.series | dump | safe }}],
		trendRoom: [{{ roomTrend.series_percent | dump | safe }}, {{ roomTrend.series | dump | safe }}],
		roomPriceData: {{ roomPrice.series | dump | safe }},
		pricePerRoom: {{ pricePerRoom.series | dump | safe }},
		map: {{ mapData | dump | safe }},
		mapText: (txt) => {
			document.getElementById('desc').innerHTML = `Der Stadtteil ${txt[0]} hat mit CHF&nbsp;${txt[1]} die tiefsten, der Stadtteil ${txt[2]} mit CHF&nbsp;${txt[3]} die höchsten Mietpreise. Das entspricht einem Unterschied von ${txt[4]} Prozent.`
		}
	},
	filters: {
		toggle: _ => {return document.getElementById('toggle').checked ? 1 : 0},
		year: document.getElementById('details_years'),
		roomPriceDistrict: document.getElementById('roompricdistricts'),
		trendDistrictRooms: document.getElementById('district-trend-rooms'),
		trendRoomDistricts: document.getElementById('rooms-trend-district'),
		mapRoom: document.getElementById('map-rooms')
	},
	options: {
		bar: {
			...commonChartOptions.basis,
			grid: {
				left: 0,
				right: 10,
				top: 10,
				bottom: 0,
				containLabel: true,
			},
			tooltip: {
				show: false,
			},
			color: "{{ roomPrice.colors }}",
			legendHoverLink: false,
			xAxis: {
				zlevel: 99,
				show: false,
		    	type: 'value',
			    axisTick: {
			      show: false
			    },
			    splitLine: {
			      show: false
			    },
			    axisLine: {
		      		show: false,
		    	},
		  	},
		  	yAxis: {
		  		zlevel: 1,
		    	type: 'category',
		    	data: {{ roomPrice.filters.rooms | dump | safe }},
		    	splitLine: {
		      		show: false
		    	},
		    	axisLine: {
		      		show: false
		    	},
		    	axisTick: {
		      		show: false
		    	},
		    	axisLabel: {
		    		inside: true,
		    		color: '#fff',
		    		fontWeight: '700',
		    	}
		  	},
		},
		roomTrend: {
			...commonChartOptions.basis,
			...commonChartOptions.trendAxis,
			color: {{ roomTrend.colors | dump | safe }},
		},
		districtTrend: {
			...commonChartOptions.basis,
			...commonChartOptions.trendAxis,
			color: {{ districtTrend.colors | dump | safe }},
		}
	},
	checkboxFilters: (area) => {
		let active = area.querySelectorAll('input[type=checkbox]');
		let i = active.length;
		const selection = {};
		
		while(i--){
			selection[active[i].value] = active[i].checked;
		}

		return selection;
	},
	trendRooms: _ => {
		const trendRooms = document.getElementById('trend-rooms');
		const chart = trendRooms.getElementsByClassName('dia')[0];
		const filters = [dashboard.filters.toggle(), dashboard.filters.trendRoomDistricts]
		const cboxes = trendRooms.getElementsByTagName('input');
		const trendRoomsEChart = echarts.init(chart, null, {renderer: 'svg'});
		const label = ['%','CHF'];
		
		trendRoomsEChart.setOption(dashboard.options.roomTrend);
		trendRoomsEChart.setOption({
			color: {{ roomTrend.colors | dump | safe }},
			yAxis: {
				name: label[filters[0]]
			},
			tooltip: {
				formatter: '{a}<br>{b}<br>{c} '+label[filters[0]],
			},
			series: dashboard.data.trendRoom[filters[0]][filters[1].value],
			legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)},
		});

		document.getElementById('toggle').addEventListener('change', (e) => {
			filters[0] = dashboard.filters.toggle();
			trendRoomsEChart.setOption({
				series: dashboard.data.trendRoom[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)},
				tooltip: {
					formatter: '{a}<br>{b}<br>{c} '+label[filters[0]],
				},
				yAxis: {
					name: label[filters[0]]
				},
			});
		})

		filters[1].addEventListener('change', (e) => {
			trendRoomsEChart.setOption({
				series: dashboard.data.trendRoom[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)},
			});
		})

		for(cbox of cboxes){
			cbox.addEventListener('click', (e) => {
				if(!trendRooms.querySelector('input[type=checkbox]:checked')){
					e.target.checked = true;
					return;
				}
				trendRoomsEChart.setOption({legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)}});
			})
		}

		return trendRoomsEChart;
	},
	trendDistrict: _ => {

		const trendDistrict = document.getElementById('trend-district');
		const chart = trendDistrict.getElementsByClassName('dia')[0];
		const cboxes = trendDistrict.querySelectorAll('input[type=checkbox]'); 
		const trendDistrictEChart = echarts.init(chart, null, {renderer: 'svg'});
		const filters = [dashboard.filters.toggle(), dashboard.filters.trendDistrictRooms]
		const label = ['%','CHF'];

		trendDistrictEChart.setOption(dashboard.options.districtTrend);
		trendDistrictEChart.setOption({
			series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
			color: {{ districtTrend.colors | dump | safe }},
			legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)},
			tooltip: {
				formatter: '{a}<br>{b}<br>{c} '+label[filters[0]],
			},
			yAxis: {
				name: label[filters[0]]
			},
		});

		document.getElementById('toggle').addEventListener('change', (e) => {
			filters[0] = dashboard.filters.toggle();
			trendDistrictEChart.setOption({
				series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)},
				tooltip: {
					formatter: '{a}<br>{b}<br>{c} '+label[filters[0]],
				},
				yAxis: {
					name: label[filters[0]]
				},
			});
		})

		filters[1].addEventListener('change', (e) => {
			trendDistrictEChart.setOption({
				series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)},
			});
		});

		for(cbox of cboxes){
			cbox.addEventListener('click', (e) => {
				if(!trendDistrict.querySelector('input[type=checkbox]:checked')){
					e.target.checked = true;
					return;
				}
				trendDistrictEChart.setOption({legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)}});
			})
		}

		return trendDistrictEChart;
	},
	roomPrice: _ => {

		const roomPrice = document.getElementById('roomprice');
		const chart = roomPrice.getElementsByClassName('dia')[0];
		const chart2 = roomPrice.getElementsByClassName('dia')[1];

		const roomPriceChart = echarts.init(chart, null, {renderer: 'svg'});
		const roomPriceChart2 = echarts.init(chart2, null, {renderer: 'svg'});
		const filters = [dashboard.filters.year, dashboard.filters.roomPriceDistrict];
		
		roomPriceChart.setOption(dashboard.options.bar);
		roomPriceChart.setOption({
			color: {{ roomPrice.colors | dump | safe }},
			series: dashboard.data.roomPriceData[filters[0].value][filters[1].value],			
		});
		
		roomPriceChart2.setOption(dashboard.options.bar);
		roomPriceChart2.setOption({
			color: {{ pricePerRoom.colors | dump | safe }},
			series: dashboard.data.pricePerRoom[filters[0].value][filters[1].value],				
		});

		filters[1].addEventListener('change', (e) => {

			roomPriceChart.setOption({
				series: dashboard.data.roomPriceData[filters[0].value][filters[1].value]
			});

			roomPriceChart2.setOption({
				series: dashboard.data.pricePerRoom[filters[0].value][filters[1].value]
			});

		})

		return [roomPriceChart, roomPriceChart2];
	},
	districtMap: _ => {

		echarts.registerMap('stadtteile', { svg: '{% include "karte.svg" %}' });
		const map = document.getElementById('map');
		const chart = map.getElementsByClassName('dia')[0];
		const mapEChart = echarts.init(chart, null, {renderer: 'svg'});
		const filters = [dashboard.filters.year, dashboard.filters.mapRoom]

		mapEChart.setOption({
			visualMap: {
				id: 'vismap',
		    	left: 'left',
		    	top: 'middle',
		      	orient: 'horizontal',
		      	realtime: true,
		      	calculable: false,
		      	textStyle: {
		      		fontSize: 14,
		      		color: '#575757',
		      	},
		      	indicatorStyle: {
		      		borderType: 'solid',
		      		borderColor: '#575757'
		      	}
		    },
		    series: [
		    	{
		            type: 'map',
		            map: 'stadtteile',
		            roam: false,
		            left: 'right',
		           	aspectScale: 1,
		            emphasis: {
		                disabled: true,
		            },
		            selectedMode: false
		        }
		        ]
		});

		dashboard.data.mapText(dashboard.data.map[filters[0].value][filters[1].value][1]);
		mapEChart.setOption(dashboard.data.map[filters[0].value][filters[1].value][0]);

		filters[0].addEventListener('change', (e) => {
			dashboard.data.mapText(dashboard.data.map[filters[0].value][filters[1].value][1]);
			mapEChart.setOption(dashboard.data.map[filters[0].value][filters[1].value][0]);
		});

		filters[1].addEventListener('change', (e) => {
			dashboard.data.mapText(dashboard.data.map[filters[0].value][filters[1].value][1]);
			mapEChart.setOption(dashboard.data.map[filters[0].value][filters[1].value][0]);
		});

		return mapEChart;
	},
	init: _ => {
		let trendDistrictChart = dashboard.trendDistrict();
		let trendRoomChart = dashboard.trendRooms();
		let roomPriceChart = dashboard.roomPrice();
		let districtMap = dashboard.districtMap();

		window.addEventListener('resize', function() {
			trendDistrictChart.resize();
			trendRoomChart.resize();
			roomPriceChart[0].resize();
			roomPriceChart[1].resize();
			districtMap.resize();
		});
	}
}

dashboard.init();

})();

