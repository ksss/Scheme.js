(function () {
	var Wark = function () {
		return this.init.apply(this, arguments);
	};

	Wark.prototype.init = function () {
		this.src = arguments[0];
		this.ch = this.src.charAt(0);
		this.at = 0;
	};

	Wark.prototype.next = function (c) {
		if (c && c !== this.ch) {
			this.error("Expected '" + c + "' instead of '" + this.ch + "' src='" + this.src + "'");
		}
		this.at += 1;
		this.ch = this.src.charAt(this.at);
		return this.ch;
	};

	Wark.prototype.back = function (c) {
		if (c && c !== this.ch) {
			this.error("Expected '" + c + "' instead of '" + this.ch + "' src='" + this.src + "'");
		}
		this.at -= 1;
		this.ch = this.src.charAt(this.at);
		return this.ch;
	};

	Wark.prototype.to = function (c) {
		while (this.ch && this.ch !== c) {
			this.next();
		}
		return this.ch;
	};

	Wark.prototype.white = function () {
		while (this.ch && this.ch <= ' ') {
			this.next();
		}
	};

	Wark.prototype.error = function (m) {
		throw {
			message: m,
			src: this.src,
			ch: this.ch,
			at: this.at,
		};
	};

	/**
	 * Wark.run(function (w) {
	 *     w.next();
	 *     ...
	 * }).error(function (ex) {
	 *     console.log(ex);
	 * });
	 */
	Wark.run = function (src, callback) {
		var w, ret;
		w = new Wark(src);
		try {
			ret = callback(w);
		} catch (ex) {
			Wark.exeption = ex;
		}
		return Wark;
	};

	Wark.error = function (callback) {
		if (Wark.exeption) {
			callback(Wark.exeption);
		}
	};

	this.Wark = Wark;
}).call(this);
