var express = require('express');
var router = express.Router();
var expressHbs = require('express-handlebars');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Offer = require('../models/offer');
var Order = require('../models/order');
var User = require('../models/user');
var nodemailer = require('nodemailer');
var csrf =  require('csurf');
var stripe = require("stripe")("sk_test_CegyT3Xslz1fCPNYtZk5dzfX");

//the search
router.post('/market/search', function(req, res, next) {
	var searched = (req.body.searchInput.toLowerCase().replace(/ /g, "-"));
	res.redirect('/market/search?q='+searched);
});
router.post('/add-to-cart', function(req, res, next) {
	var product = req.query.prod;
	var page = req.url;
	res.redirect('/add-to-cart?prod='+product+'&page='+page);
});
router.post('/add-to-cart-page', function(req, res, next) {
	var product = req.query.prod;
	var page = req.url;
	var qty = req.body.quantidy;
	var kind = req.body.kind;
	console.log('qty is '+qty+' & kind is '+kind)
	res.redirect('/add-to-cart-page?prod='+product+'&page='+page+'&qty='+qty+'&kind='+kind);
});
router.get('/checkout', function(req, res, next) {
	if (!req.session.cart) {
		return res.redirect('shop/sh-cart');
	}
	var cart = new Cart(req.session.cart);
	var errMsg = req.flash('error')[0];
	if (req.user) {
		var id = req.user.id;
		User.find({_id: id}, function(err, user) {
			if (err) throw err;
			res.render('shop/checkout-logged', {title: 'Checkout', user: user, total: cart.totalPrice, errMsg: errMsg, noError: !errMsg, layout: 'other'})
		})
	} else {
		res.render('shop/checkout', {title: 'Checkout', total: cart.totalPrice, errMsg: errMsg, noError: !errMsg, layout: 'other'})
	}
});
router.post('/checkout', function(req, res, next) {
	if (!req.session.cart) {
		return res.redirect('shop/sh-cart');
	}
	var cart = new Cart(req.session.cart);
	
	stripe.charges.create({
	  amount: cart.totalPrice * 100,
	  currency: "usd",
	  source: req.body.stripeToken, // obtained with Stripe.js
	  description: "Charge"
	}, function(err, charge) {
		if (err) {
	  		req.flash('error', err.message);
	  		return res.redirect('/checkout');
	    }

		if (req.body.address === 'newAddress') {
			var address = req.body.newAddress;
			var id = req.user.id;
			User.findOneAndUpdate({_id: id}, {$addToSet:{adress: address}}, function(err, doc){
    		if(err){
        		console.log("Something wrong when updating data!");
    		}
    		console.log(doc);
			});
		} else { var address = req.body.address; }

		let transporter = nodemailer.createTransport({
	        service: 'gmail',
	        secure: false,
	        port: 25,
	         // true for 465, false for other ports
	        auth: {
	            user: "apolouser03@gmail.com", // generated ethereal user
	            pass: "dontwantto03"  // generated ethereal password
	        },
	        tls: {
	        	rejectUnauthorized: false
	        }
	    });		
	    // setup email data with unicode symbols
	    let HelperOptions = {
	        from: '"arbi" <apolouser03@gmail.com>', // sender address
	        to: 'arbihysko@gmail.com', // list of receivers
	        subject: 'Order', // Subject line
	        html: "<h1>New order from "+req.body.email+"</h1><br><br>" + cart.generateArray().title + "<br><br><h3>Zona --> "+req.body.zone+"</h3><br><h3>Adresa --> "+address+"</h3><br><h3>Nr-tel --> "+req.body.tel+"</h3>", // plain text body
	    };		
	    // send mail with defined transport object
	    transporter.sendMail(HelperOptions, (error, info) => {
	        if (error) {
	            throw error;
	        }
	        console.log('Message sent: %s', info.messageId);
	        console.logl(info);		
	    });


	    if(req.user) {
	  	var order = new Order({
        	user: req.user,
        	cart: cart,
        	address: req.body.address,
        	name: req.body.name,
        	paymentId: charge.id
        });
      	order.save(function(err, result) {
      		if (err) {return res.redirect('/')}
      		req.flash('success', 'Blerja u krye me sukses!');
	    	req.session.cart = null;
	    	res.redirect('/market');
      	});
      	}
      	if(!req.user) {
      		req.flash('success', 'Blerja u krye me sukses!');
	    	req.session.cart = null;
	    	res.redirect('/market');
      	}
	});
});

router.post('/newAddress', function(req, res, next) {
	if (req.user) {
		var address = req.body.newAddress;
		var id = req.user.id;
		User.findOneAndUpdate({_id: id}, {$addToSet:{adress: address}}, function(err, doc){
	  		if(err){
	      		console.log("Something wrong when updating data!");
	  		}
	  		console.log(doc);
		});
		res.redirect("/user/profile/address");
	} else {
		res.redirect('/')
	}
});

//using csrf protection
var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', function(req, res, next) {
	Offer.find(function(err, docs) {
		var messages = req.flash('error');
		res.render('shop/index', { title: 'YourShop', offers: docs, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
	});
});

//the pagination
router.get('/market', function(req, res, next) {
	var page = req.query.page; 
	//limit
	var per_page = 9; 
	if (page === null) {
		page = 0;
	} 
	if (!req.query.page) {
		return res.redirect('/market/?page=0');
	} else {
		Product.count({}, function(err, docs) { 
			if (req.query.category) {
				var category = req.query.category;
				Product.find({category: category}).skip(page*per_page).limit(per_page).exec(function(err, docs) { 
					var productChunks = [];
					var chunkSize = 3;
					for (var i = 0; i < docs.length; i += chunkSize) {
						productChunks.push(docs.slice(i, i + chunkSize));
					};
					var successMsg = req.flash('success')[0];
					var messages = req.flash('error');	
					var link = '/market/?category='+category+'&page=';	

					if (productChunks.length > 0) {res.render('shop/market', { title: 'Marketi', products: productChunks, page: page, link: link, successMsg: successMsg, noMessages: !successMsg, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});}
					else {res.redirect('/market')}
				}); 
			} else {
				Product.find({}).skip(page*per_page).limit(per_page).exec(function(err, docs) { 
					var productChunks = [];
					var chunkSize = 3;
					for (var i = 0; i < docs.length; i += chunkSize) {
						productChunks.push(docs.slice(i, i + chunkSize));
					};
					var successMsg = req.flash('success')[0];
					var messages = req.flash('error');	
					var link = '/market/?page=';		

					if (productChunks.length > 0) {res.render('shop/market', { title: 'Marketi', products: productChunks, page: page, link: link, successMsg: successMsg, noMessages: !successMsg, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});}
					else {res.redirect('/market')}
				}); 
			}
		});
	}
});

router.get('/market', function(req, res, next) {
	res.redirect('/market/page/0');
});

router.get('/market/product', function(req, res, next) {
	Product.find({_id: req.query.p }, function(err, docs) {
		var title =docs[0].title;
		var messages = req.flash('error');
		res.render('shop/product', {title: title, product: docs, csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
	});
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

router.get('/add-to-cart', function(req, res, next) {
	var productId = req.query.prod;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if (err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(cart);
		var origin = req.get('Referrer');
		res.redirect(origin);
	});
});

router.get('/add-to-cart-page', function(req, res, next) {
	var productId = req.query.prod;
	
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if (err) {
			return res.redirect('/');
		}
		var quty = req.query.qty;
		var kind = req.query.kind;
		cart.bigAdd(product, product.id, quty, kind);
		req.session.cart = cart;
		console.log(cart);
		var origin = req.get('Referrer');
		res.redirect(origin);
	});
});

router.get('/reduce/:id', function(req, res, next) {
	var id = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	var kind = req.query.kind;
	cart.reduceByOne(id, kind);
	req.session.cart = cart;
	res.redirect('/cart')
});

router.get('/remove/:id', function(req, res, next) {
	var id = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	var kind = req.query.kind;
	cart.removeItem(id, kind);
	req.session.cart = cart;
	res.redirect('/cart')
});

router.get('/cart', function(req, res, next) {
	if (!req.session.cart) {
		return res.render('shop/sh-cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/sh-cart', {title: 'Shporta', products: cart.generateArray(), totalPrice: cart.totalPrice});
	console.log(JSON.stringify(cart.generateArray().item));
});

module.exports = router;