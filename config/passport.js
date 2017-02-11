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
	req.checkBody('firstName', 'Invalid name!').notEmpty();
	req.checkBody('lastName', 'Invalid lastName!').notEmpty();
	req.checkBody('email', 'Invalid e-mail!').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password!').notEmpty().isLength({min:6});
	req.checkBody('adress', 'Invalid adress!').notEmpty();
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
			return done(null, false, {message: 'Email already in use!'});
		}
		var newUser = new User();
		  newUser.firstName = firstName;
		  newUser.lastName = lastName;
		  newUser.email = email;
		  newUser.password = newUser.encryptPassword(password);
		  newUser.adress = adress;
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
	req.checkBody('email', 'Invalid e-mail!').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password!').notEmpty();
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
			return done(null, false, {message: 'No user found'});
		}
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'Pass i gabuar'});
		}
		return done(null, user);
	});
}));