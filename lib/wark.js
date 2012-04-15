(function () {
	var Wark = function () {
		return this.init.apply(this, arguments);
	};

	Wark.prototype.init = function () {
		this.src = arguments[0];
		this.ch = this.src.charAt(0);
		this.at = 1;
	};

	Wark.prototype.next = function (c) {
		if (c && c !== this.ch) {
			throw "Expected '" + c + "' instead of '" + this.ch + "' src='" + this.src + "'";
		}
		this.ch = this.src.charAt(this.at);
		this.at += 1;
		return this.ch;
	};

	Wark.prototype.white = function () {
		while (this.ch && this.ch <= ' ') {
			this.next();
		}
	};

	Wark.run = function (src, callback) {
		var w = new Wark(src);
		return callback(w);
	};

	this.Wark = Wark;
}).call(this);
