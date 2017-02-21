var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf =  require('csurf');

//the search
router.post('/market/search', function(req, res, next) {
	var searched = (req.body.searchInput.toLowerCase().replace(/ /g, "-"));
	res.redirect('/market/search?q='+searched);
});

//using csrf protection
var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', function(req, res, next) {
	var messages = req.flash('error');
	res.render('shop/index', { title: 'YourShop', csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
});

//the pagination
router.get('/market/page/:page', function(req, res, next) {
	var page = req.params.page; 
	//limit
	var per_page = 9; 
	if (page === null) {
		page = 0;
	} 
	Product.count({}, function(err, docs) { 
		Product.find({}).skip(page*per_page).limit(per_page).exec(function(err, docs) { 
			var productChunks = [];
			var chunkSize = 3;
			for (var i = 0; i < docs.length; i += chunkSize) {
				productChunks.push(docs.slice(i, i + chunkSize));
			};
			var messages = req.flash('error');
			if (productChunks.length > 0) {res.render('shop/market', { title: 'Marketi', products: productChunks, page: page, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});}
			else {res.redirect('/market')}
		}); 
	});
});

router.get('/market', function(req, res, next) {
	res.redirect('/market/page/0');
});

//getting results of the search
router.get('/market/search', function(req, res, next) {
	Product.find({title: { $regex: req.query.q.replace(/\-/g, " ") } }, function(err, docs) {
		if (err) throw err;
		var productChunks = [];
		var chunkSize = 3;
		for (var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		};
		var messages = req.flash('error');
		if (productChunks.length > 0) {res.render('shop/search', { title: 'Rezultatet e kerkimit', value: req.query.q.replace(/\-/g, " "), products: productChunks, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});}
		else {res.render('shop/search-error', { title: 'Error', value: req.query.q.replace(/\-/g, " "), csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});}
		
	});
});

module.exports = router;