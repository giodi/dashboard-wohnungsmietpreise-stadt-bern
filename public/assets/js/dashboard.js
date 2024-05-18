// console.log({{ roomPrice.series[0] | dump | safe }})

	const data = {
		trendDistrict: [{{ districtTrend.series_percent | dump | safe }}, {{ districtTrend.series | dump | safe }}],
	}
	
	const baseOptions = {
		grid: {
			left: 0,
			right: 0,
			top: 0,
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

	const barOptions = {
		...baseOptions,
		color: "{{ roomPrice.colors }}",
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
	  	series: {{ roomPrice.series[0][0] | dump | safe }}
	};

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

	const optionRoomTrend = {
	  ...baseOptions,
	  color: {{ roomTrend.colors | dump | safe }},
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
	  series: {{ roomTrend.series_percent[0] | dump | safe }}
	};

	const roomPricePerRoom = echarts.init(
		document.getElementById('room-price-per-room'), null, {
			 renderer: 'svg'
		}
	);

	
	roomPricePerRoom.setOption(barOptions);
	
	trendDistrictData = {{ districtTrend.series | dump | safe }};
	trendDistrictData_percent = {{ districtTrend.series_percent | dump | safe }};
	
	trendRoomData = {{ roomTrend.series | dump | safe }};

	const dashboard = {
		trendDistrictData: {{ districtTrend.series_percent | dump | safe }},
		toggle: _ => {
			const toggleBtn = document.querySelector('.switch');
			toggleBtn.addEventListener('change', (e) => {
				dashboard.trendDistrictData = e.target.checked ? trendDistrictData_percent :  trendDistrictData;
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
		setSelectFilter: (chart, select, seriesData) => {
			select.addEventListener('change', (e) => {
				chart.setOption({series: seriesData[e.target.value]});
			});
		},
		trendRooms: _ => {
			const trendRooms = document.getElementById('trend-rooms');
			const chart = trendRooms.getElementsByClassName('dia')[0];
			const select = trendRooms.getElementsByTagName('select')[0];
			const checkboxes = trendRooms.getElementsByTagName('input');
			const trendRoomsEChart = echarts.init(chart, null, {renderer: 'svg'});

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
			}

			dashboard.setSelectFilter(trendRoomsEChart, select, trendRoomData)
			trendRoomsEChart.setOption(optionRoomTrend);
		},
		trendDistrict: _ => {
			const trendDistrict = document.getElementById('trend-district');
			const chart = trendDistrict.getElementsByClassName('dia')[0];
			const select = trendDistrict.getElementsByTagName('select')[0];
			const cboxes = trendDistrict.querySelectorAll('input[type=checkbox]'); 
			const trendDistrictEChart = echarts.init(chart, null, {renderer: 'svg'});

			trendDistrictEChart.setOption(optionDistrictTrend);
			trendDistrictEChart.setOption({series: dashboard.trendDistrictData[select.value]});

			dashboard.setCboxFilters(trendDistrictEChart, cboxes, trendDistrict, dashboard.trendDistrictData);
			dashboard.setSelectFilter(trendDistrictEChart, select, dashboard.trendDistrictData);
			
		},
		roomPrice: _ => {
			
			const roomPrice = document.getElementById('room-price');
			const chart = roomPrice.getElementsByClassName('dia')[0];

			const roomPriceChart = echarts.init(chart, null, {renderer: 'svg'});
			roomPriceChart.setOption(barOptions);

		},
		init: _ => {
			dashboard.trendDistrict();
			dashboard.trendRooms();
			dashboard.roomPrice();
		}
	}

	dashboard.init();