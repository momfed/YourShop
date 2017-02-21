var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var adress = req.body.adress;
	var zone = req.body.zone;
	var tel = req.body.tel;
	req.checkBody('firstName', 'Ju lutem vendosni emrin!').notEmpty();
	req.checkBody('lastName', 'Ju lutem vendosni mbiemrin!').notEmpty();
	req.checkBody('email', 'Email-i nuk eshte i sakte!').notEmpty().isEmail();
	req.checkBody('password', 'Password-i duhet te permbaje me shume se 6 karaktere!').notEmpty().isLength({min:6});
	req.checkBody('adress', 'Ju lutem vendosni adresen tuaj!').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	};
	User.findOne({'email': email}, function(err, user){
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false, {message: 'Email-i eshte ne perdorim!'});
		}
		var newUser = new User();
		  newUser.firstName = firstName;
		  newUser.lastName = lastName;
		  newUser.email = email;
		  newUser.password = newUser.encryptPassword(password);
		  newUser.adress = adress;
		  newUser.zone = zone;
		  newUser.tel = tel;
		  newUser.save(function(err, result) {
		  	if (err) {
		  		return done(err);
		  	}
		  	return done(null, newUser);
		  });
	});
}));
passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	password: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	req.checkBody('email', 'Email-i nuk eshte i sakte!').notEmpty().isEmail();
	req.checkBody('password', 'Password-i nuk eshte i sakte!').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	};
	User.findOne({'email': email}, function(err, user){
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, {message: 'Nuk u gjet asnje perdorues me keto te dhena.'});
		}
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'Password i gabuar!'});
		}
		return done(null, user);
	});
}));