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
		dataType:'jsonp',
		headers: {
			'Authorization': 'Token MDoxZmYyNzU4MC03NWE3LTExZTgtYmVmMy0zYmY0Njk4ZDI5YTA6cHhBRGw5RWFmMjZuQk1PcWJhZzg1Vm5OMzBLaWpkTnNqU0ZW'
			},
		data: {
			product_id: idNumber,
			per_page: 3,
			lat: latitude,
			lng: longitude
		}
		}).then(function(res) {	
			const stores = res.result;
			console.log(stores);
		});
}


wineApp.init = () => {
	$('#wineButton').on('click', function(e) {
		e.preventDefault();
		$('#loader').addClass("loader");
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
