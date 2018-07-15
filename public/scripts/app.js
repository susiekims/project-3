(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var wineApp = {};

wineApp.wineList = [];

wineApp.pageNumber = 1;

wineApp.productID;

var searchFood = void 0;
var searchPrice = void 0;

wineApp.getWines = function (food, price, pageNumber) {
	$.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		headers: {
			'Authorization': 'Token MDoxZmYyNzU4MC03NWE3LTExZTgtYmVmMy0zYmY0Njk4ZDI5YTA6cHhBRGw5RWFmMjZuQk1PcWJhZzg1Vm5OMzBLaWpkTnNqU0ZW'
		},
		data: {
			per_page: 100,
			page: pageNumber,
			q: 'wine',
			order: 'price_in_cents.asc'
		}
	}).then(function (res) {

		var products = res.result;

		searchFood = $('#food').val();
		searchPrice = $('#price').val();

		// console.log(products);

		if (products.length === 100 && products[99].price_in_cents < price) {
			wineApp.pageNumber++;
			// console.log(wineApp.pageNumber);
			wineApp.getWines(searchFood, searchPrice, wineApp.pageNumber);
			var filteredWineList = products.filter(function (product) {
				return product.serving_suggestion != null && product.image_url != null && product.primary_category === 'Wine' && product.price_in_cents >= price - 400 && product.serving_suggestion.indexOf(food) != -1 && product.package_unit_volume_in_milliliters === 750;
			});

			if (filteredWineList.length > 0) {

				wineApp.wineList.push(filteredWineList);
				// console.log(filteredWineList);
			}
		} else {
			console.log('no more wine!');
			wineApp.flattenArray();
		}
	});
};

wineApp.flattenArray = function () {
	var flattenedList = wineApp.wineList.reduce(function (a, b) {
		return a.concat(b);
	});
	// console.log(flattenedList);
	wineApp.pickRandomWine(flattenedList);
};

wineApp.pickRandomWine = function (arr) {
	var theWinner = arr[Math.floor(Math.random() * arr.length)];
	console.log(theWinner);
	wineApp.displayWine(theWinner);
};

wineApp.displayWine = function (wine) {
	$('#loader').removeClass("loader");
	$('#locations').toggle(true);
	var $name = $('<h2>').text(wine.name);
	var $producer = $('<h3>').text(wine.producer_name);
	var $varietal = $('<p>').text(wine.varietal);
	var $taste = $('<p>').text(wine.tasting_note);
	var $imgURL = $('<img>').attr('src', wine.image_url);
	$('#wine').append($name, $producer, $varietal, $taste, $imgURL);
	wineApp.productID = wine.id;
};

wineApp.getUserCoords = function () {
	navigator.geolocation.getCurrentPosition(function (position) {
		var userLat = position.coords.latitude;
		var userLng = position.coords.longitude;
		wineApp.getStores(wineApp.productID, userLat, userLng);
	});
};

wineApp.getStores = function (idNumber, latitude, longitude) {
	$.ajax({
		url: 'https://lcboapi.com/stores',
		method: 'GET',
		dataType: 'jsonp',
		headers: {
			'Authorization': 'Token MDoxZmYyNzU4MC03NWE3LTExZTgtYmVmMy0zYmY0Njk4ZDI5YTA6cHhBRGw5RWFmMjZuQk1PcWJhZzg1Vm5OMzBLaWpkTnNqU0ZW'
		},
		data: {
			product_id: idNumber,
			per_page: 3,
			lat: latitude,
			lng: longitude
		}
	}).then(function (res) {
		var stores = res.result;
		console.log(stores);
	});
};

wineApp.init = function () {
	$('#wineButton').on('click', function (e) {
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
	$('#storeButton').on('click', function (e) {
		wineApp.getUserCoords();
	});
};

$(function () {
	wineApp.init();
});

// 1. how to loop through function on how many pages exist
// 2. how to run flattenArray after getAllWines (promises?)

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sVUFBVSxFQUFoQjs7QUFFQSxRQUFRLFFBQVIsR0FBbUIsRUFBbkI7O0FBRUEsUUFBUSxVQUFSLEdBQXFCLENBQXJCOztBQUVBLFFBQVEsU0FBUjs7QUFFQSxJQUFJLG1CQUFKO0FBQ0EsSUFBSSxvQkFBSjs7QUFFQSxRQUFRLFFBQVIsR0FBbUIsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFjLFVBQWQsRUFBNkI7QUFDL0MsR0FBRSxJQUFGLENBQU87QUFDTixPQUFLLDhCQURDO0FBRU4sVUFBUSxLQUZGO0FBR04sWUFBUyxNQUhIO0FBSU4sV0FBUztBQUNSLG9CQUFpQjtBQURULEdBSkg7QUFPTixRQUFNO0FBQ0wsYUFBVSxHQURMO0FBRUwsU0FBTSxVQUZEO0FBR0wsTUFBRyxNQUhFO0FBSUwsVUFBTztBQUpGO0FBUEEsRUFBUCxFQWFJLElBYkosQ0FhUyxVQUFTLEdBQVQsRUFBYzs7QUFFckIsTUFBTSxXQUFXLElBQUksTUFBckI7O0FBRUEsZUFBYSxFQUFFLE9BQUYsRUFBVyxHQUFYLEVBQWI7QUFDQSxnQkFBYyxFQUFFLFFBQUYsRUFBWSxHQUFaLEVBQWQ7O0FBRUE7O0FBRUQsTUFBSSxTQUFTLE1BQVQsS0FBb0IsR0FBcEIsSUFBMkIsU0FBUyxFQUFULEVBQWEsY0FBYixHQUE4QixLQUE3RCxFQUFvRTtBQUNuRSxXQUFRLFVBQVI7QUFDQTtBQUNBLFdBQVEsUUFBUixDQUFpQixVQUFqQixFQUE2QixXQUE3QixFQUEwQyxRQUFRLFVBQWxEO0FBQ0EsT0FBTSxtQkFBbUIsU0FBUyxNQUFULENBQWdCLFVBQUMsT0FBRCxFQUFhO0FBQ3JELFdBQU8sUUFBUSxrQkFBUixJQUE4QixJQUE5QixJQUNILFFBQVEsU0FBUixJQUFxQixJQURsQixJQUVBLFFBQVEsZ0JBQVIsS0FBNkIs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QSxRQUFRLElBQVIsR0FBZSxZQUFNO0FBQ3BCLEdBQUUsYUFBRixFQUFpQixFQUFqQixDQUFvQixPQUFwQixFQUE2QixVQUFTLENBQVQsRUFBWTtBQUN4QyxJQUFFLGNBQUY7QUFDQSxJQUFFLFNBQUYsRUFBYSxRQUFiLENBQXNCLFFBQXRCO0FBQ0EsVUFBUSxVQUFSLEdBQXFCLENBQXJCO0FBQ0EsVUFBUSxRQUFSLEdBQW1CLEVBQW5CO0FBQ0EsSUFBRSxPQUFGLEVBQVcsS0FBWDtBQUNBLGVBQWEsRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUFiO0FBQ0EsZ0JBQWMsRUFBRSxRQUFGLEVBQVksR0FBWixFQUFkO0FBQ0EsVUFBUSxHQUFSLENBQVksYUFBYSxXQUF6QjtBQUNBLFVBQVEsUUFBUixDQUFpQixVQUFqQixFQUE2QixXQUE3QixFQUEwQyxRQUFRLFVBQWxEO0FBQ0EsRUFWRDtBQVdBLEdBQUUsY0FBRixFQUFrQixFQUFsQixDQUFxQixPQUFyQixFQUE4QixVQUFTLENBQVQsRUFBWTtBQUN6QyxVQUFRLGFBQVI7QUFDQSxFQUZEO0FBR0EsQ0FmRDs7QUFpQkEsRUFBRSxZQUFXO0FBQ1osU0FBUSxJQUFSO0FBQ0EsQ0FGRDs7QUFLQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qgd2luZUFwcCA9IHt9XG5cbndpbmVBcHAud2luZUxpc3QgPSBbXTtcblxud2luZUFwcC5wYWdlTnVtYmVyID0gMTtcblxud2luZUFwcC5wcm9kdWN0SUQ7XG5cbmxldCBzZWFyY2hGb29kIDtcbmxldCBzZWFyY2hQcmljZSA7XG5cbndpbmVBcHAuZ2V0V2luZXMgPSAoZm9vZCwgcHJpY2UsIHBhZ2VOdW1iZXIpID0+IHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwczovL2xjYm9hcGkuY29tL3Byb2R1Y3RzJyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOidqc29uJyxcblx0XHRoZWFkZXJzOiB7XG5cdFx0XHQnQXV0aG9yaXphdGlvbic6ICdUb2tlbiBNRG94Wm1ZeU56VTRNQzAzTldFM0xURXhaVGd0WW1WbU15MHpZbVkwTmprNFpESTVZVEE2Y0hoQlJHdzVSV0ZtTWpadVFrMVBjV0poWnpnMVZtNU9NekJMYVdwa1RuTnFVMFpXJ1xuXHRcdFx0fSxcblx0XHRkYXRhOiB7XG5cdFx0XHRwZXJfcGFnZTogMTAwLFxuXHRcdFx0cGFnZTogcGFnZU51bWJlcixcblx0XHRcdHE6ICd3aW5lJyxcblx0XHRcdG9yZGVyOiAncHJpY2VfaW5fY2VudHMuYXNjJ1xuXHRcdH1cblx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XG5cdFx0XHRjb25zdCBwcm9kdWN0cyA9IHJlcy5yZXN1bHQ7XG5cblx0XHRcdHNlYXJjaEZvb2QgPSAkKCcjZm9vZCcpLnZhbCgpO1xuXHRcdFx0c2VhcmNoUHJpY2UgPSAkKCcjcHJpY2UnKS52YWwoKTtcblxuXHRcdFx0Ly8gY29uc29sZS5sb2cocHJvZHVjdHMpO1xuXG5cdFx0aWYgKHByb2R1Y3RzLmxlbmd0aCA9PT0gMTAwICYmIHByb2R1Y3RzWzk5XS5wcmljZV9pbl9jZW50cyA8IHByaWNlKSB7XG5cdFx0XHR3aW5lQXBwLnBhZ2VOdW1iZXIrKztcblx0XHRcdC8vIGNvbnNvbGUubG9nKHdpbmVBcHAucGFnZU51bWJlcik7XG5cdFx0XHR3aW5lQXBwLmdldFdpbmVzKHNlYXJjaEZvb2QsIHNlYXJjaFByaWNlLCB3aW5lQXBwLnBhZ2VOdW1iZXIpO1xuXHRcdFx0Y29uc3QgZmlsdGVyZWRXaW5lTGlzdCA9IHByb2R1Y3RzLmZpbHRlcigocHJvZHVjdCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gcHJvZHVjdC5zZXJ2aW5nX3N1Z2dlc3Rpb24gIT0gbnVsbCAmJlxuXHRcdFx0XHRcdCAgIHByb2R1Y3QuaW1hZ2VfdXJsICE9IG51bGwgJiZcbiAgICBcdFx0XHRcdCAgIHByb2R1Y3QucHJpbWFyeV9jYXRlZ29yeSA9PT0gJ1dpbmUnICYmXG4gICAgXHRcdFx0XHQgICBwcm9kdWN0LnByaWNlX2luX2NlbnRzID49IHByaWNlIC0gNDAwICYmXG4gICAgXHRcdFx0XHQgICBwcm9kdWN0LnNlcnZpbmdfc3VnZ2VzdGlvbi5pbmRleE9mKGZvb2QpICE9IC0xICYmXG4gICAgXHRcdFx0XHQgICBwcm9kdWN0LnBhY2thZ2VfdW5pdF92b2x1bWVfaW5fbWlsbGlsaXRlcnMgPT09IDc1MDtcblxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChmaWx0ZXJlZFdpbmVMaXN0Lmxlbmd0aCA+IDApIHtcblxuXHRcdFx0XHR3aW5lQXBwLndpbmVMaXN0LnB1c2goZmlsdGVyZWRXaW5lTGlzdCk7XG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGZpbHRlcmVkV2luZUxpc3QpO1xuXHRcdFx0fVx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdubyBtb3JlIHdpbmUhJylcblx0XHRcdHdpbmVBcHAuZmxhdHRlbkFycmF5KCk7XG5cdFx0fVxuXHR9KTtcbn1cblxud2luZUFwcC5mbGF0dGVuQXJyYXkgPSAoKSA9PiB7XG5cdGNvbnN0IGZsYXR0ZW5lZExpc3QgPSB3aW5lQXBwLndpbmVMaXN0LnJlZHVjZShmdW5jdGlvbihhLCBiKSB7XG4gIFx0XHRcdHJldHVybiBhLmNvbmNhdChiKTtcblx0XHR9KTtcblx0XHQvLyBjb25zb2xlLmxvZyhmbGF0dGVuZWRMaXN0KTtcblx0XHR3aW5lQXBwLnBpY2tSYW5kb21XaW5lKGZsYXR0ZW5lZExpc3QpO1xufVxuXG53aW5lQXBwLnBpY2tSYW5kb21XaW5lID0gKGFycikgPT4ge1xuXHRjb25zdCB0aGVXaW5uZXIgPSBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmFyci5sZW5ndGgpXTtcblx0Y29uc29sZS5sb2codGhlV2lubmVyKTtcblx0d2luZUFwcC5kaXNwbGF5V2luZSh0aGVXaW5uZXIpO1xufVxuXG53aW5lQXBwLmRpc3BsYXlXaW5lID0gKHdpbmUpID0+IHtcblx0JCgnI2xvYWRlcicpLnJlbW92ZUNsYXNzKFwibG9hZGVyXCIpO1xuXHQkKCcjbG9jYXRpb25zJykudG9nZ2xlKHRydWUpO1xuXHRjb25zdCAkbmFtZSA9ICQoJzxoMj4nKS50ZXh0KHdpbmUubmFtZSk7XG5cdGNvbnN0ICRwcm9kdWNlciA9ICQoJzxoMz4nKS50ZXh0KHdpbmUucHJvZHVjZXJfbmFtZSk7XG5cdGNvbnN0ICR2YXJpZXRhbCA9ICQoJzxwPicpLnRleHQod2luZS52YXJpZXRhbCk7XG5cdGNvbnN0ICR0YXN0ZSA9ICQoJzxwPicpLnRleHQod2luZS50YXN0aW5nX25vdGUpO1xuXHRjb25zdCAkaW1nVVJMID0gJCgnPGltZz4nKS5hdHRyKCdzcmMnLCB3aW5lLmltYWdlX3VybCk7XG5cdCQoJyN3aW5lJykuYXBwZW5kKCRuYW1lLCAkcHJvZHVjZXIsICR2YXJpZXRhbCwgJHRhc3RlLCAkaW1nVVJMKTtcblx0d2luZUFwcC5wcm9kdWN0SUQgPSB3aW5lLmlkO1xufVxuXG5cbndpbmVBcHAuZ2V0VXNlckNvb3JkcyA9ICgpID0+IHtcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHVzZXJMYXQgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XG4gICAgICAgIGNvbnN0IHVzZXJMbmcgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICB3aW5lQXBwLmdldFN0b3Jlcyh3aW5lQXBwLnByb2R1Y3RJRCwgdXNlckxhdCwgdXNlckxuZyk7XG4gICAgfSk7XG59XG5cbndpbmVBcHAuZ2V0U3RvcmVzID0gKGlkTnVtYmVyLCBsYXRpdHVkZSwgbG9uZ2l0dWRlKSA9PiB7XG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnaHR0cHM6Ly9sY2JvYXBpLmNvbS9zdG9yZXMnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6J2pzb25wJyxcblx0XHRoZWFkZXJzOiB7XG5cdFx0XHQnQXV0aG9yaXphdGlvbic6ICdUb2tlbiBNRG94Wm1ZeU56VTRNQzAzTldFM0xURXhaVGd0WW1WbU15MHpZbVkwTmprNFpESTVZVEE2Y0hoQlJHdzVSV0ZtTWpadVFrMVBjV0poWnpnMVZtNU9NekJMYVdwa1RuTnFVMFpXJ1xuXHRcdFx0fSxcblx0XHRkYXRhOiB7XG5cdFx0XHRwcm9kdWN0X2lkOiBpZE51bWJlcixcblx0XHRcdHBlcl9wYWdlOiAzLFxuXHRcdFx0bGF0OiBsYXRpdHVkZSxcblx0XHRcdGxuZzogbG9uZ2l0dWRlXG5cdFx0fVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHRcblx0XHRcdGNvbnN0IHN0b3JlcyA9IHJlcy5yZXN1bHQ7XG5cdFx0XHRjb25zb2xlLmxvZyhzdG9yZXMpO1xuXHRcdH0pO1xufVxuXG5cbndpbmVBcHAuaW5pdCA9ICgpID0+IHtcblx0JCgnI3dpbmVCdXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoJyNsb2FkZXInKS5hZGRDbGFzcyhcImxvYWRlclwiKTtcblx0XHR3aW5lQXBwLnBhZ2VOdW1iZXIgPSAxO1xuXHRcdHdpbmVBcHAud2luZUxpc3QgPSBbXTtcblx0XHQkKCcjd2luZScpLmVtcHR5KCk7XG5cdFx0c2VhcmNoRm9vZCA9ICQoJyNmb29kJykudmFsKCk7XG5cdFx0c2VhcmNoUHJpY2UgPSAkKCcjcHJpY2UnKS52YWwoKTtcblx0XHRjb25zb2xlLmxvZyhzZWFyY2hGb29kICsgc2VhcmNoUHJpY2UpO1xuXHRcdHdpbmVBcHAuZ2V0V2luZXMoc2VhcmNoRm9vZCwgc2VhcmNoUHJpY2UsIHdpbmVBcHAucGFnZU51bWJlcik7XG5cdH0pO1x0XG5cdCQoJyNzdG9yZUJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHR3aW5lQXBwLmdldFVzZXJDb29yZHMoKTtcblx0fSk7XG59XG5cbiQoZnVuY3Rpb24oKSB7XG5cdHdpbmVBcHAuaW5pdCgpO1xufSk7XG5cblxuLy8gMS4gaG93IHRvIGxvb3AgdGhyb3VnaCBmdW5jdGlvbiBvbiBob3cgbWFueSBwYWdlcyBleGlzdFxuLy8gMi4gaG93IHRvIHJ1biBmbGF0dGVuQXJyYXkgYWZ0ZXIgZ2V0QWxsV2luZXMgKHByb21pc2VzPylcbiJdfQ==
