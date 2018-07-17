const wineApp = {}
wineApp.productID;

let searchFood ;
let searchPrice ;

wineApp.getWines = (food, price, pageNumber) => {
$('#map').toggle(false);	
const randomPageNumber = Math.floor(Math.random()*100);	
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
		}
		}).then(function(res) {
			const products = res.result;
			searchFood = $('#food').val();
			searchPrice = $('#price').val();

			const filteredWineList = products.filter((product) => {
				return product.serving_suggestion != null &&
					   product.image_url != null &&
    				   product.primary_category === 'Wine' &&
    				   product.price_in_cents >= price - 400 &&
    				   product.serving_suggestion.indexOf(food) != -1 &&
    				   product.package_unit_volume_in_milliliters === 750;
			});
			console.log(pageNumber);
			console.log(filteredWineList);
			
			if (filteredWineList.length > 0) {
				const randomWine = filteredWineList[Math.floor(Math.random()*filteredWineList.length)];
				console.log(randomWine);
				wineApp.displayWine(randomWine);
			} else {
				wineApp.getWines(searchFood, searchPrice, randomPageNumber);
			}
	});
}

wineApp.displayWine = (wine) => {
	$('#loader').removeClass("loader");
	$('#locations').toggle(true);
	const $name = $('<h2>').text(wine.name);
	const $producer = $('<h3>').text(wine.producer_name);
	const $varietal = $('<p>').text(wine.varietal);
	const $serving = $('<p>').text(wine.serving_suggestion);
	const $taste = $('<p>').text(wine.tasting_note);
	const $imgURL = $('<img>').attr('src', wine.image_url);
	$('#wine').append($name, $producer, $varietal, $taste, $serving, $imgURL);
	wineApp.productID = wine.id;
}


wineApp.getUserCoords = () => {
    navigator.geolocation.getCurrentPosition(function(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        wineApp.getStores(wineApp.productID, userLat, userLng);
    });
}

wineApp.msmTo24time = (msm) => {
        const hour = msm / 60;
        const mins = msm % 60;
        if (mins === 0) {
            const twoZeroes = '00'
            return [Math.floor(hour), twoZeroes];
        } else {
        	return [Math.floor(hour), mins];
        }
    } 
wineApp.msmTo12time = (msm) => {
        const time = wineApp.msmTo24time(msm);
        const h24  = time[0];
        const h12  = (0 == h24 ? 12 : (h24 > 12 ? (h24 - 10) - 2 : h24));
        const ampm = (h24 >= 12 ? 'PM' : 'AM');
		return [h12, time[1], ampm];
    }
wineApp.getTime = (msm) => {
        const time = wineApp.msmTo12time(msm);
        const newTime = time[0] + ':' + time[1] + time[2];
        return (newTime);
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
		if (stores.length == 0) {
				$('#map').append(`<h1>Sorry, no stores near you carry this wine</h1>`)
		} else {

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
					hours: {
						monday: {
							open: wineApp.getTime(stores[i].monday_open),
							close: wineApp.getTime(stores[i].monday_close)
						},
						tuesday: {
							open: wineApp.getTime(stores[i].tuesday_open),
							close: wineApp.getTime(stores[i].tuesday_close)
						},
						wednesday: {
							open: wineApp.getTime(stores[i].wednesday_open),
							close: wineApp.getTime(stores[i].wednesday_close)
						},
						thursday: {
							open: wineApp.getTime(stores[i].thursday_open),
							close: wineApp.getTime(stores[i].thursday_close)
						},
						friday: {
							open: wineApp.getTime(stores[i].friday_open),
							close: wineApp.getTime(stores[i].friday_close)
						},
						saturday: {
							open: wineApp.getTime(stores[i].saturday_open),
							close: wineApp.getTime(stores[i].saturday_close)
						},
						sunday: {
							open: wineApp.getTime(stores[i].sunday_open),
							close: wineApp.getTime(stores[i].sunday_close)
						}
					},
					quantity: stores[i].quantity,
					distance: stores[i].distance_in_meters/1000,
					address: stores[i].address_line_1		
				}
			}

			wineApp.loadMap(userCoords, storeInfo);
		
		}	
		});
}

wineApp.loadMap = (centerCoords, storesWithProduct) => {
	$('#map').toggle(true);	
	$('#list').toggle(true);
	const map = new google.maps.Map(
		document.getElementById('map'), {zoom: 12, center: centerCoords});
	const markers = [];
	const infoWindow = [];
	const contentHTML = [];
	const locationsHTML = [];


	for (let i = 0; i < storesWithProduct.length; i++) {
		contentHTML[i] = `<div id="content_${i}">
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
		const userMarker = new google.maps.Marker(
			{
				position: centerCoords, 
				map: map
			}
		);
		markers[i] = new google.maps.Marker(
			{
				position: storesWithProduct[i].coords, 
				label: `${i+1}`,
				map: map
			}
		);
        infoWindow[i] = new google.maps.InfoWindow({
        	content: contentHTML[i]
        });
        markers[i].addListener('click', function() {
        	infoWindow[i].open(map, markers[i]);
        });
        locationsHTML[i] = `
		<li>
			<h3>${storesWithProduct[i].storeName}</h3>
			<p>${storesWithProduct[i].address}</p>
			<p>${storesWithProduct[i].distance}km away</p>
			<p>${storesWithProduct[i].quantity} bottles in stock</p>
		</li>
        `
        $('#list').append(locationsHTML[i]);
	}
}

wineApp.init = () => {
	$('#wineButton').on('click', function(e) {
		e.preventDefault();
		$('#loader').addClass("loader");
		$('#locations').toggle(false);
		$('#wine').empty();
		searchFood = $('#food').val();
		searchPrice = $('#price').val();
		console.log(searchFood + searchPrice);
		wineApp.getWines(searchFood, searchPrice, Math.floor(Math.random()*100));
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
