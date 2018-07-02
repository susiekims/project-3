(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// PSEUDOCODE
// ask user what they are eating
// ask user for price range
// return random wine within those parameters


var wineApp = {};

wineApp.wineList = [];

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
			page: pageNumber
		}
	}).then(function (res) {

		var products = res.result;

		var filteredWineList = products.filter(function (product) {
			return product.serving_suggestion != null && product.primary_category === 'Wine' && product.price_in_cents <= price && product.price_in_cents >= price - 400 && product.serving_suggestion.indexOf('' + food) !== -1;
		});

		if (filteredWineList.length > 0) {
			wineApp.wineList.push(filteredWineList);
		}
	});
};

wineApp.getAllWines = function () {
	for (var i = 1; i < 5; i++) {
		var searchFood = $('#food').val();
		var searchPrice = $('#price').val();
		wineApp.getWines(searchFood, searchPrice, i);
	}
	console.log(wineApp.wineList);
};

wineApp.init = function () {
	$('form').on('submit', function (e) {
		e.preventDefault();
		wineApp.getAllWines();
	});
};

$(function () {
	wineApp.init();
});

// EXTRA FEATURES
// ask user for location
// limit result to wine in stock at close LCBOs

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxJQUFNLFVBQVUsRUFBaEI7O0FBRUEsUUFBUSxRQUFSLEdBQW1CLEVBQW5COztBQUVBLFFBQVEsUUFBUixHQUFtQixVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsVUFBZCxFQUE2QjtBQUMvQyxHQUFFLElBQUYsQ0FBTztBQUNOLE9BQUssOEJBREM7QUFFTixVQUFRLEtBRkY7QUFHTixZQUFTLE1BSEg7QUFJTixXQUFTO0FBQ1Isb0JBQWlCO0FBRFQsR0FKSDtBQU9OLFFBQU07QUFDTCxhQUFVLEdBREw7QUFFTCxTQUFNO0FBRkQ7QUFQQSxFQUFQLEVBV0ksSUFYSixDQVdTLFVBQVMsR0FBVCxFQUFjOztBQUVyQixNQUFNLFdBQVcsSUFBSSxNQUFyQjs7QUFFQSxNQUFNLG1CQUFtQixTQUFTLE1BQVQsQ0FBZ0IsVUFBQyxPQUFELEVBQWE7QUFDckQsVUFBTyxRQUFRLGtCQUFSLElBQThCLElBQTlCLElBQ0EsUUFBUSxnQkFBUixLQUE2QixNQUQ3QixJQUVBLFFBQVEsY0FBUixJQUEwQixLQUYxQixJQUdBLFFBQVEsY0FBUixJQUEwQixRQUFRLEdBSGxDLElBSUEsUUFBUSxrQkFBUixDQUEyQixPQUEzQixNQUFzQyxJQUF0QyxNQUFrRCxDQUFDLENBSjFEO0FBS0EsR0FOd0IsQ0FBekI7O0FBUUEsTUFBSSxpQkFBaUIsTUFBakIsR0FBMEIsQ0FBOUIsRUFBaUM7QUFDaEMsV0FBUSxRQUFSLENBQWlCLElBQWpCLENBQXNCLGdCQUF0QjtBQUNBO0FBQ0QsRUExQkY7QUEyQkEsQ0E1QkQ7O0FBOEJBLFFBQVEsV0FBUixHQUFzQixZQUFNO0FBQzNCLE1BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE2QjtBQUM1QixNQUFNLGFBQWEsRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUFuQjtBQUNBLE1BQU0sY0FBYyxFQUFFLFFBQUYsRUFBWSxHQUFaLEVBQXBCO0FBQ0EsVUFBUSxRQUFSLENBQWlCLFVBQWpCLEVBQTZCLFdBQTdCLEVBQTBDLENBQTFDO0FBQ0E7QUFDRCxTQUFRLEdBQVIsQ0FBWSxRQUFRLFFBQXBCO0FBQ0EsQ0FQRDs7QUFVQSxRQUFRLElBQVIsR0FBZSxZQUFNO0FBQ3BCLEdBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsQ0FBVCxFQUFZO0FBQ2xDLElBQUUsY0FBRjtBQUNBLFVBQVEsV0FBUjtBQUNBLEVBSEQ7QUFJQSxDQUxEOztBQU9BLEVBQUUsWUFBVztBQUNaLFNBQVEsSUFBUjtBQUNBLENBRkQ7O0FBS0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG4vLyBQU0VVRE9DT0RFXG4vLyBhc2sgdXNlciB3aGF0IHRoZXkgYXJlIGVhdGluZ1xuLy8gYXNrIHVzZXIgZm9yIHByaWNlIHJhbmdlXG4vLyByZXR1cm4gcmFuZG9tIHdpbmUgd2l0aGluIHRob3NlIHBhcmFtZXRlcnNcblxuXG5jb25zdCB3aW5lQXBwID0ge31cblxud2luZUFwcC53aW5lTGlzdCA9IFtdO1xuXG53aW5lQXBwLmdldFdpbmVzID0gKGZvb2QsIHByaWNlLCBwYWdlTnVtYmVyKSA9PiB7XG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnaHR0cHM6Ly9sY2JvYXBpLmNvbS9wcm9kdWN0cycsXG5cdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRkYXRhVHlwZTonanNvbicsXG5cdFx0aGVhZGVyczoge1xuXHRcdFx0J0F1dGhvcml6YXRpb24nOiAnVG9rZW4gTURveFptWXlOelU0TUMwM05XRTNMVEV4WlRndFltVm1NeTB6WW1ZME5qazRaREk1WVRBNmNIaEJSR3c1UldGbU1qWnVRazFQY1dKaFp6ZzFWbTVPTXpCTGFXcGtUbk5xVTBaVydcblx0XHRcdH0sXG5cdFx0ZGF0YToge1xuXHRcdFx0cGVyX3BhZ2U6IDEwMCxcblx0XHRcdHBhZ2U6IHBhZ2VOdW1iZXIsXG5cdFx0fVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcblx0XHRcdGNvbnN0IHByb2R1Y3RzID0gcmVzLnJlc3VsdDtcblx0XG5cdFx0XHRjb25zdCBmaWx0ZXJlZFdpbmVMaXN0ID0gcHJvZHVjdHMuZmlsdGVyKChwcm9kdWN0KSA9PiB7XG5cdFx0XHRcdHJldHVybiBwcm9kdWN0LnNlcnZpbmdfc3VnZ2VzdGlvbiAhPSBudWxsICYmXG4gICAgXHRcdFx0XHQgICBwcm9kdWN0LnByaW1hcnlfY2F0ZWdvcnkgPT09ICdXaW5lJyAmJlxuICAgIFx0XHRcdFx0ICAgcHJvZHVjdC5wcmljZV9pbl9jZW50cyA8PSBwcmljZSAmJlxuICAgIFx0XHRcdFx0ICAgcHJvZHVjdC5wcmljZV9pbl9jZW50cyA+PSBwcmljZSAtIDQwMCAmJlxuICAgIFx0XHRcdFx0ICAgcHJvZHVjdC5zZXJ2aW5nX3N1Z2dlc3Rpb24uaW5kZXhPZihgJHtmb29kfWApICE9PSAtMTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoZmlsdGVyZWRXaW5lTGlzdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHdpbmVBcHAud2luZUxpc3QucHVzaChmaWx0ZXJlZFdpbmVMaXN0KTtcblx0XHRcdH1cblx0XHR9KTtcbn1cblxud2luZUFwcC5nZXRBbGxXaW5lcyA9ICgpID0+IHtcblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA1OyBpICsrKSB7XG5cdFx0Y29uc3Qgc2VhcmNoRm9vZCA9ICQoJyNmb29kJykudmFsKCk7XG5cdFx0Y29uc3Qgc2VhcmNoUHJpY2UgPSAkKCcjcHJpY2UnKS52YWwoKTtcblx0XHR3aW5lQXBwLmdldFdpbmVzKHNlYXJjaEZvb2QsIHNlYXJjaFByaWNlLCBpKTtcblx0fVxuXHRjb25zb2xlLmxvZyh3aW5lQXBwLndpbmVMaXN0KTtcbn1cblxuXG53aW5lQXBwLmluaXQgPSAoKSA9PiB7XG5cdCQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR3aW5lQXBwLmdldEFsbFdpbmVzKCk7XG5cdH0pO1xufVxuXG4kKGZ1bmN0aW9uKCkge1xuXHR3aW5lQXBwLmluaXQoKTtcbn0pO1xuXG5cbi8vIEVYVFJBIEZFQVRVUkVTXG4vLyBhc2sgdXNlciBmb3IgbG9jYXRpb25cbi8vIGxpbWl0IHJlc3VsdCB0byB3aW5lIGluIHN0b2NrIGF0IGNsb3NlIExDQk9zIl19
