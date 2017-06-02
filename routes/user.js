var express = require('express');
var router = express.Router();
var csrf =  require('csurf');
var passport = require('passport');
var User = require('../models/user');
var Cart = require('../models/cart');
var Order = require('../models/order');
var mongoose = require('mongoose');

var csrfProtection = csrf();
router.use(csrfProtection);

var uri = 'mongodb://localhost/shopping';

router.get('/profile', isLoggedIn, function(req, res, next) {
	var id = req.user.id;
	User.find({_id: id}, function(err, user) {
		if (err) throw err;
		res.render('user/profile', {title: 'Profili', user: user});
	});
});

router.get('/profile/history', isLoggedIn, function(req, res, next) {
	Order.find({user: req.user}, function(err, orders) {
		if (err) {
			return res.write('error');
		}
		var cart;
		orders.forEach(function(order) {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render('user/history', {title: 'Historiku', orders: orders});
	});
});

router.get('/profile/user', isLoggedIn, function(req, res, next) {
	var id = req.user.id;
	User.find({_id: id}, function(err, user) {
		if (err) throw err;
		res.render('user/user', {title: 'Te dhenat', user: user});
	});
});

router.get('/profile/address', isLoggedIn, function(req, res, next) {
	var id = req.user.id;
	User.find({_id: id}, function(err, user) {
		if (err) throw err;
		res.render('user/address', {title: 'Adresat', user: user});
	});
});

router.get('/logout', function(req, res, next) {
	req.logout()
	res.redirect(req.get('Referrer'));
});

router.use('/', notLoggedIn, function(req, res, next) {
	next();
});

router.get('/signup', function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signup', {title: 'Rregjistrohuni', csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signin', {title: 'Hyni ne Logari' ,csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
	failureRedirect: '/user/signin',
	failureFlash: true
}), function(req, res, next) {
	res.redirect(req.get('Referrer'));
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/user/signin')
}

function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/')
}