
// PSEUDOCODE
// ask user what they are eating
// ask user for price range
// return random wine within those parameters


const wineApp = {}

wineApp.wineList = [];

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
		}
		}).then(function(res) {
			
			const products = res.result;
	
			const filteredWineList = products.filter((product) => {
				return product.serving_suggestion != null &&
    				   product.primary_category === 'Wine' &&
    				   product.price_in_cents <= price &&
    				   product.price_in_cents >= price - 400 &&
    				   product.serving_suggestion.indexOf(`${food}`) !== -1;
			});

			if (filteredWineList.length > 0) {
				wineApp.wineList.push(filteredWineList);
			}
		});
}

wineApp.getAllWines = () => {
	for (let i = 1; i < 5; i ++) {
		const searchFood = $('#food').val();
		const searchPrice = $('#price').val();
		wineApp.getWines(searchFood, searchPrice, i);
	}
	console.log(wineApp.wineList);
}


wineApp.init = () => {
	$('form').on('submit', function(e) {
		e.preventDefault();
		wineApp.getAllWines();
	});
}

$(function() {
	wineApp.init();
});


// EXTRA FEATURES
// ask user for location
// limit result to wine in stock at close LCBOs