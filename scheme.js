var p, pp, util;
util = require('util');

p = function() {
	return console.log(Array.prototype.slice.call(arguments));
};

pp = function(obj) {
	return console.log(util.inspect(obj, true, null));
};

(function() {
	var Scheme = function () {
		return this.init.apply(this, arguments);
	};

	Scheme.prototype.init = function () {
		return this;
	};

	Scheme.prototype.perse = function(src) {
		var list, l, set, nest, depth;
		depth = 0;
		nest = function () {
			var car, ret;
			ret = [];
			while (car = l.shift()) {
				if (car.charAt(0) === '(') {
					depth += 1;
					l.unshift(car.substr(1, car.length - 1));
					ret.push(nest());
				} else if (0 <= car.indexOf(')')) {
					depth -= 1;
					if (car !== ')') {
						ret.push(car.substr(0, car.indexOf(')')));
					}
					break;
				} else {
					ret.push(car);
				}
			}
			return ret;
		};

		set = function(li) {
			var car, cdr, cell;
			cell = li.shift();
			if (cell === undefined) {
				return null;
			} else if (Array.isArray(cell)) {
				if (li.length !== 0) {
					car = set(cell);
					cdr = set(li);
				} else {
					return set(cell);
				}
			} else if (/\D+/.test(cell)) {
				car = cell;
				cdr = set(li);
			} else if (/\d+/.test(cell)) {
				car = Number(cell);
				cdr = set(li);
			} else {
				throw {
					message: "set error",
					car: car,
					cdr: cdr,
					li: li,
					cell: cell,
				};
			}
			return {
				car: car,
				cdr: cdr
			};
		};

		src = src.replace(/;.*\n/g, '');
		src = src.replace(/[\s\t\n]+$/, '')
		l = src.split(/[\s\t\n]+/);
		list = nest();
		return set(list[0]);
	};

// {{{ eval
		Scheme.prototype.eval = function(src) {
			/*
			var at, ch, error, next, self, symbol, white;
			src = src.replace(/;.*?\n/g, '');
			ch = src.charAt(0);
			at = 0;
			self = this;
			error = function(m) {
				if (m == null) m = "Error";
				throw {
					message: m
				};
			};
			next = function(c) {
				if (c && c !== ch) error("Syntax error");
				ch = src.charAt(at);
				at += 1;
				return ch;
			};
			white = function() {
				var _results;
				_results = [];
				while (ch && ch <= '') {
					_results.push(next());
				}
				return _results;
			};
			symbol = function() {
				symbol = "";
				if (ch === '(') {
					next('(');
					while (next()) {
						if (ch === ')') {
							return null;
						} else if (ch === ' ') {
							white();
							break;
						} else {
							symbol += ch;
						}
					}
				} else {
					error("Symbol error");
				}
				return symbol;
			};
			return 1;
			*/
			return this.perse(src);
			// TODO displayつくる
		};
// }}}

	this.Scheme = Scheme;

}).call(this);
