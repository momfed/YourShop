var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf =  require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', function(req, res, next) {
	Product.find(function(err, docs){
		var productChunks = [];
		var chunkSize = 3;
		for (var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		};
		var messages = req.flash('error');
		res.render('shop/index', { title: 'YourShop', products: productChunks, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
	});
});

module.exports = router;