module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, id) {
		var storedItem = this.items[id];
		if (!storedItem) {
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	}

	this.bigAdd = function(item, id, quty, kind) {
		if (kind == 'undefined') {
			var storedItem = this.items[id];
			if (!storedItem) {
				storedItem = this.items[id] = {item: item, qty: 0, price: 0};
			}
		} else {
			var storedItem = this.items[id, kind];
			if (!storedItem) {
				storedItem = this.items[id, kind] = {item: item, qty: 0, price: 0};
			}
			storedItem.kind = kind;
		}
		storedItem.qty += parseInt(quty);
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty += parseInt(quty);
		this.totalPrice += storedItem.item.price * parseInt(quty);
	}

	this.reduceByOne = function(id, kind) {
		if (kind == 'null') {var storedItem = this.items[id]} else {var storedItem = this.items[id, kind]}
		storedItem.qty--;
		storedItem.price -= storedItem.item.price;
		this.totalQty--;
		this.totalPrice -= storedItem.item.price;

		if (storedItem.qty <= 0) {
			if (kind == 'null') {
				delete this.items[id];
			} else {
				delete this.items[id,kind];
			}
		}
	}

	this.removeItem = function(id, kind) {
		if (kind == 'null') {var storedItem = this.items[id]} else {var storedItem = this.items[id, kind]}
		this.totalQty-= storedItem.qty;
		this.totalPrice -= storedItem.price;

		if (kind == 'null') {
			delete this.items[id];
		} else {
			delete this.items[id,kind];
		}
	}

	this.generateArray = function() {
		var arr = [];
		for (var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};