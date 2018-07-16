const wineApp = {}

wineApp.wineList = [];

wineApp.pageNumber = 1;

wineApp.productID;

let searchFood ;
let searchPrice ;

wineApp.getWines = (food, price, pageNumber) => {
	$.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType:'json',
		headers: {
			'Authorization': 'Token MDoxZmYyNzU4MC03NWE3LTExZTgtYmVmMy0zYmY0Njk4ZDI5YTA6cHhBRGw5RWFmMjZuQk1PcWJhZzg1Vm5OMzBLaWpkTnNqU0ZW'
			},
		data: {
			per_page: 100,
			page: pageNumber,
			q: 'wine',
			order: 'price_in_cents.asc'
		}
		}).then(function(res) {
			
			const products = res.result;

			searchFood = $('#food').val();
			searchPrice = $('#price').val();

			// console.log(products);

		if (products.length === 100 && products[99].price_in_cents < price) {
			wineApp.pageNumber++;
			// console.log(wineApp.pageNumber);
			wineApp.getWines(searchFood, searchPrice, wineApp.pageNumber);
			const filteredWineList = products.filter((product) => {
				return product.serving_suggestion != null &&
					   product.image_url != null &&
    				   product.primary_category === 'Wine' &&
    				   product.price_in_cents >= price - 400 &&
    				   product.serving_suggestion.indexOf(food) != -1 &&
    				   product.package_unit_volume_in_milliliters === 750;

			});

			if (filteredWineList.length > 0) {

				wineApp.wineList.push(filteredWineList);
				// console.log(filteredWineList);
			}	
		} else {
			console.log('no more wine!')
			wineApp.flattenArray();
		}
	});
}

wineApp.flattenArray = () => {
	const flattenedList = wineApp.wineList.reduce(function(a, b) {
  			return a.concat(b);
		});
		// console.log(flattenedList);
		wineApp.pickRandomWine(flattenedList);
}

wineApp.pickRandomWine = (arr) => {
	const theWinner = arr[Math.floor(Math.random()*arr.length)];
	console.log(theWinner);
	wineApp.displayWine(theWinner);
}

wineApp.displayWine = (wine) => {
	$('#loader').removeClass("loader");
	$('#locations').toggle(true);
	const $name = $('<h2>').text(wine.name);
	const $producer = $('<h3>').text(wine.producer_name);
	const $varietal = $('<p>').text(wine.varietal);
	const $taste = $('<p>').text(wine.tasting_note);
	const $imgURL = $('<img>').attr('src', wine.image_url);
	$('#wine').append($name, $producer, $varietal, $taste, $imgURL);
	wineApp.productID = wine.id;
}


wineApp.getUserCoords = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        wineApp.getStores(wineApp.productID, userLat, userLng);
    });
}

wineApp.getStores = (idNumber, latitude, longitude) => {
	$.ajax({
		url: 'https://lcboapi.com/stores',
		method: 'GET',
		dataType:'json',
		headers: {
			'Authorization': 'Token MDoxZmYyNzU4MC03NWE3LTExZTgtYmVmMy0zYmY0Njk4ZDI5YTA6cHhBRGw5RWFmMjZuQk1PcWJhZzg1Vm5OMzBLaWpkTnNqU0ZW'
			},
		data: {
			product_id: idNumber,
			per_page: 10,
			lat: latitude,
			lon: longitude
		}
		}).then(function(res) {	
			const stores = res.result;
			console.log(stores);
			const userCoords = {
				lat: latitude,
				lng: longitude
			}
			const storeInfo = []
			for (let i = 0; i < stores.length; i++) {
				storeInfo[i] = {
					coords: {
						lat: stores[i].latitude,
						lng: stores[i].longitude
					},	
					storeName: stores[i].name,
					quantity: stores[i].quantity,
					hours: {
						monday: {
							open: stores[i].monday_open,
							close: stores[i].monday_close
						},
						tuesday: {
							open: stores[i].tuesday_open,
							close: stores[i].tuesday_close
						},
						wednesday: {
							open: stores[i].wednesday_open,
							close: stores[i].wednesday_close
						},
						thursday: {
							open: stores[i].thursday_open,
							close: stores[i].thursday_close
						},
						friday: {
							open: stores[i].friday_open,
							close: stores[i].friday_close
						},
						saturday: {
							open: stores[i].saturday_open,
							close: stores[i].saturday_close
						},
						sunday: {
							open: stores[i].sunday_open,
							close: stores[i].sunday_close
						}
					},
				}
			}
			wineApp.loadMap(userCoords, storeInfo);
		});
}

wineApp.loadMap = (centerCoords, storesWithProduct) => {
	const map = new google.maps.Map(
		document.getElementById('map'), {zoom: 12, center: centerCoords});
	const markers = [];
	const infoWindow = [];
	const content = [];
	for (let i = 0; i < storesWithProduct.length; i++) {
		content[i] = `<div id="content_${i}">
			<h3>${storesWithProduct[i].storeName}</h3>
			<h3>Hours</h3>
			<ul>
				<li>Monday: ${storesWithProduct[i].hours.monday.open} - ${storesWithProduct[i].hours.monday.close}</li>
				<li>Tuesday: ${storesWithProduct[i].hours.tuesday.open} - ${storesWithProduct[i].hours.tuesday.close}</li>
				<li>Wednesday: ${storesWithProduct[i].hours.wednesday.open} - ${storesWithProduct[i].hours.wednesday.close}</li>
				<li>Thursday: ${storesWithProduct[i].hours.thursday.open} - ${storesWithProduct[i].hours.thursday.close}</li>
				<li>Friday: ${storesWithProduct[i].hours.friday.open} - ${storesWithProduct[i].hours.friday.close}</li>
				<li>Saturday: ${storesWithProduct[i].hours.saturday.open} - ${storesWithProduct[i].hours.saturday.close}</li>
				<li>Sunday: ${storesWithProduct[i].hours.sunday.open} - ${storesWithProduct[i].hours.sunday.close}</li>
			</ul>
			<h3>Bottles in stock: ${storesWithProduct[i].quantity}</h3>
		`;
		markers[i] = new google.maps.Marker(
			{
				position: storesWithProduct[i].coords, 
				label: `${i+1}`,
				map: map
			}
		);
        infoWindow[i] = new google.maps.InfoWindow({
        	content: content[i]
        });
        markers[i].addListener('click', function() {
        	infoWindow[i].open(map, markers[i]);
        });
	}
}

wineApp.init = () => {
	$('#wineButton').on('click', function(e) {
		e.preventDefault();
		$('#loader').addClass("loader");
		$('#locations').toggle(false);
		wineApp.pageNumber = 1;
		wineApp.wineList = [];
		$('#wine').empty();
		searchFood = $('#food').val();
		searchPrice = $('#price').val();
		console.log(searchFood + searchPrice);
		wineApp.getWines(searchFood, searchPrice, wineApp.pageNumber);
	});	
	$('#storeButton').on('click', function(e) {
		wineApp.getUserCoords();
	});
}

$(function() {
	wineApp.init();
});


// 1. how to loop through function on how many pages exist
// 2. how to run flattenArray after getAllWines (promises?)
