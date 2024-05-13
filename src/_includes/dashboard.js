const data = {
	trendDistrict: [{{ districtTrend.series_percent | dump | safe }}, {{ districtTrend.series | dump | safe }}],
}

const baseOptions = {

	grid: {
		left: 0,
		right: 0,
		top: 5,
		bottom: 0,
			containLabel: true,
		},
		tooltip: {
			show: true,
			trigger: 'item',
			backgroundColor: "#575757",
			borderColor: "#575757",
			textStyle: {
				color: '#fff'
			},
			axisPointer: {
				type: 'line',
				snap: true
			}
		}
	}

	const axisOptions = {
		axisLine: {
	      show: true,
	      lineStyle: {
	      	color: '#575757'
	      },
	    },
	    axisLabel: {
	    	fontSize: 14, 
	    	fontFamily: 'Inter, sans-serif',
	    },
	}

	const optionDistrictTrend = {
	  ...baseOptions,
	  color: {{ districtTrend.colors | dump | safe }},
	  xAxis: {
	    type: 'category',
	    data: [{% for year in data_absolut.years %}{{ year.year }},{% endfor %}],
	  	...axisOptions,
	  	onZero: false,
	  	axisTick: {
	  		alignWithLabel: true,
	  	}
	  },
	  yAxis: {
	  	...axisOptions,
	    type: 'value',
	    scale: true,
	    axisTick: {
	    	show: true,
	    	alignWithLabel: true,
	    },
	    splitLine: {
	    	show: false
	    }
	  },
	  series: data.trendDistrict[0]
	};

	const trendDistrictData = {{ districtTrend.series | dump | safe }};
	const trendDistrictData_percent = {{ districtTrend.series_percent | dump | safe }};
	const roomPriceData = {{ roomPrice.series | dump | safe }}
	const pricePerRoom = {{ pricePerRoom.series | dump | safe }}

	const dashboard = {
		data: {
			trendDistrict: [{{ districtTrend.series_percent | dump | safe }}, {{ districtTrend.series | dump | safe }}],
			trendRoom: [{{ roomTrend.series_percent | dump | safe }}, {{ roomTrend.series | dump | safe }}]
		},
		filters: {
			toggle: _ => {return document.getElementById('toggle').checked ? 1 : 0},
			year: document.getElementById('details_years'),
			roomPriceDistrict: document.getElementById('roomprice'),
			trendDistrictRooms: document.getElementById('district-trend-rooms'),
			trendRoomDistricts: document.getElementById('rooms-trend-district')
		},
		barOptions: {
			grid: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				containLabel: true,
			},
			animation: false,
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
		      		show: false
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
		    		fontWeight: '700'
		    	}
		  	},
		},
		optionRoomTrend: {
			grid: {
				left: 0,
				right: 0,
				top: 5,
				bottom: 0,
				containLabel: true,
			},
			tooltip: {
				show: true,
				trigger: 'item',
				backgroundColor: "#575757",
				borderColor: "#575757",
				textStyle: {
					color: '#fff'
				},
				axisPointer: {
					type: 'line',
					snap: true
				}
			},
		  	xAxis: {
		    	type: 'category',
		    	data: [{% for year in data_absolut.years %}{{ year.year }},{% endfor %}],
		    	axisLine: {
		    		onZero: false
		    	}
		  	},
		 	yAxis: {
		    	type: 'value',
		    	scale: true,
		    	axisTick: {
		    		show: true,
		    	},
		    	axisLine: {
		      		show: true,
		    	},
		    	splitLine: {
		    		show: false
		    	}
		  	},
		},
		toggle: _ => {
			const toggleBtn = document.getElementById('toggle');
			toggleBtn.addEventListener('change', (e) => {
				location.reload();
			});
		},
		setCboxFilters: (chart, cboxes, parEl, seriesData) => {

			for(let cb of cboxes){
				cb.addEventListener('click', (e) => {
					let rooms = document.querySelector('select').value;
					let active = parEl.querySelectorAll('input[type=checkbox]:checked');
					let i = active.length;
					series = [];
					while(i--){
						series.push(seriesData[rooms][active[i].value]);
					}
					chart.clear();
					chart.setOption({series: series, notMerge: false, replaceMerge: ['series']});
				});
			}

		},
		trendRooms: _ => {

			const trendRooms = document.getElementById('trend-rooms');
			const chart = trendRooms.getElementsByClassName('dia')[0];
			const filters = [dashboard.filters.toggle(), dashboard.filters.trendRoomDistricts]
			const checkboxes = trendRooms.getElementsByTagName('input');
			const trendRoomsEChart = echarts.init(chart, null, {renderer: 'svg'});
			
			trendRoomsEChart.setOption(dashboard.optionRoomTrend);
			trendRoomsEChart.setOption({
				color: {{ roomTrend.colors | dump | safe }},
				series: dashboard.data.trendRoom[filters[0]][filters[1].value]
			});

			filters[1].addEventListener('change', (e) => {
				trendRoomsEChart.setOption({
					series: dashboard.data.trendRoom[filters[0]][filters[1].value]
				});
			})


			/*
			for(let checkbox of checkboxes){
				checkbox.addEventListener('click', (e) => {
					let active = trendRooms.querySelectorAll('input[type=checkbox]:checked');
					let i = active.length;

					newSeries = [];
					while(i--){
						newSeries.push(trendRoomData[1][active[i].value]);
					}

					console.log(newSeries);
					
					trendRoomsEChart.setOption({series: newSeries, notMerge: true});
				});
			}*/

			//dashboard.setSelectFilter(trendRoomsEChart, select, trendRoomData)
			
		},
		trendDistrict: _ => {

			const trendDistrict = document.getElementById('trend-district');
			const chart = trendDistrict.getElementsByClassName('dia')[0];
			const cboxes = trendDistrict.querySelectorAll('input[type=checkbox]'); 
			const trendDistrictEChart = echarts.init(chart, null, {renderer: 'svg'});

			const filters = [dashboard.filters.toggle(), dashboard.filters.trendDistrictRooms]

			trendDistrictEChart.setOption(optionDistrictTrend);
			trendDistrictEChart.setOption({
				series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
				color: {{ districtTrend.colors | dump | safe }},
			});

			filters[1].addEventListener('change', (e) => {
				trendDistrictEChart.setOption({
					series: dashboard.data.trendDistrict[filters[0]][filters[1].value]
				});
			})
	
		},
		roomPrice: _ => {

			const roomPrice = document.getElementById('room-price');
			const chart = roomPrice.getElementsByClassName('dia')[0];
			const chart2 = roomPrice.getElementsByClassName('dia')[1];
			const roomPriceChart = echarts.init(chart, null, {renderer: 'svg'});
			const roomPriceChart2 = echarts.init(chart2, null, {renderer: 'svg'});
			const filters = [dashboard.filters.year, dashboard.filters.roomPriceDistrict];
			
			roomPriceChart.setOption(dashboard.barOptions);
			roomPriceChart.setOption({
				color: {{ roomPrice.colors | dump | safe }},
				series: roomPriceData[filters[0].value][filters[1].value],				
			});			
			
			roomPriceChart2.setOption(dashboard.barOptions);
			roomPriceChart2.setOption({
				color: {{ pricePerRoom.colors | dump | safe }},
				series: pricePerRoom[filters[0].value][filters[1].value],				
			});
			

			filters[1].addEventListener('change', (e) => {
				roomPriceChart.setOption({
					series: roomPriceData[filters[0].value][filters[1].value]
				});
				roomPriceChart2.setOption({
					series: pricePerRoom[filters[0].value][filters[1].value]
				});
			})

		},
		init: _ => {
			dashboard.trendDistrict();
			dashboard.trendRooms();
			dashboard.roomPrice();
			dashboard.toggle();
		}
	}

	dashboard.init();