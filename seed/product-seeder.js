var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
	new Product({
		imagePATH: 'http://www.stama.co/wp-content/uploads/CROISSANTBELINOCOCOACREAM80g.jpg',
		title: 'Kroasant Belino',
		description: 'Kroasant me shije cokollate, qershi etj bla bla bla se kuptoj se pse duhet te shikosh ktu sikur ske ngren naj her e se di ca esht',
		price: 50,
	}),
	new Product({
		imagePATH: 'http://vignette3.wikia.nocookie.net/mms/images/b/bc/Product_peanutmms.png/revision/latest?cb=20120802170006',
		title: 'Karamele m&m',
		description: 'again the same thind just make some dummy tekst and things like that bla bla bla itiotic  dfdjfiodj',
		price: 60,
	}),
	new Product({
		imagePATH: 'https://www.snickers.com/Resources/images/nutrition/products/large/1_Snickers.jpg',
		title: 'Snickers',
		description: 'Kto i ka fiksim prs turi se sa her kto merr pr shembul',
		price: 70,
	}),
	new Product({
		imagePATH: 'https://images-na.ssl-images-amazon.com/images/I/811oScdr21L._SX522_.jpg',
		title: 'Cokollate Milka',
		description: 'pr ket skm ca te them po vl m thjesht shkruj kott',
		price: 150,
	}),
	new Product({
		imagePATH: 'http://www.colgate.co.uk/ColgateOralCare/Toothpaste/MaxWhiteOne_v2/UK/EN/locale-assets/images/heros/productActive.png',
		title: 'Colgate max white one',
		description: 'se kuptoj se cpune ka kjo ktu po njs bl bla bla bla bla dfhdiufhdi fdiufhdiuf doijfpojf iuhgiudfbmbouifg',
		price: 350,
	}),
	new Product({
		imagePATH: 'https://ll-us-i5.wal.co/asr/a26fd9b5-b916-4e4c-a074-0eddba491528_1.e33d986617597b1dd6b574dbd4e25023.jpeg-cc6d8a4681dee358c032589e2d396d13dd9736a1-optim-2000x2000.jpg',
		title: 'Lays',
		description: 'ajri me cmim me te shtrenjte ne treg',
		price: 50,
	}),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
	products[i].save(function(err, result){
		done++;
		if (done === products.length){
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
};