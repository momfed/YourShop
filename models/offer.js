var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	imagePATH: {type: String, required: true},
	title: {type: String, required: true},
	offer: {type: String, required: true},
	slice: {type: Number, required: true},
	price: {type: Number, required: true},
	price2: {type: Number, required: true},
	badge: {type: Number, required:true}

});

module.exports = mongoose.model('Offer', schema);