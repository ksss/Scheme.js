var p, pp, util;
util = require('util');

p = function () {
	console.log('\n# p');
	console.log(Array.prototype.slice.call(arguments));
	console.log();
};

pp = function (obj) {
	var args = Array.prototype.slice.call(arguments);
	for (var i = 0, it; (it = args[i]); i++) {
		console.log('\n# pp');
		console.log(util.inspect(it, true, null));
	}
	console.log();
};

(function () {
	var Scheme = function () {
		return this.init.apply(this, arguments);
	};

	Scheme.prototype.init = function () {
		if (arguments.length !== 1) {
			this.error("no src");
		}
		this.src = arguments[0];
		this.data = this.perse();
		this.builtin();
		return this;
	};

	// {{{ perse
	Scheme.prototype.perse = function () {
		var list, l, set, nest, depth, src;
		depth = 0;
		nest = function () {
			var car, ret;
			ret = [];
			while (car = l.shift()) {
				if (car.charAt(0) === '(') {
					depth += 1;
					l.unshift(car.substr(1, car.length - 1));
					ret.push(nest());
				} else if (0 === car.indexOf(')')) {
					depth -= 1;
					l.unshift(car.substr(car.indexOf(')'), car.length - 1));
				} else if (0 < car.indexOf(')')) {
					ret.push(car.substr(0, car.indexOf(')')));
					l.unshift(car.substr(car.indexOf(')'), car.length - 1));
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
			}
			return {
				car: car,
				cdr: cdr
			};
		};

		if (!this.src) {
			this.error("not set src");
		}
		src = this.src.replace(/;.*\n/g, '');
		src = src.replace(/^[\s\t\n]+|[\s\t\n]+$/g, '')
		l = src.split(/[\s\t\n]+/g);
		list = nest();
		if (depth !== 0) {
			this.error("nest error depth=" + depth);
		}
		return set(list[0]);
	};
	// }}}

	// {{{ error
	Scheme.prototype.error = function (m, obj) {
		throw {
			data: this.data,
			src: this.src,
			message: m,
			obj: obj,
		}
	}
	// }}}

	// {{{ eval
	Scheme.prototype.eval = function () {
		switch (this.car) {
			case 'display':
				this.print();
				break;
			default:
		}
	};
	// }}}

	Scheme.prototype.run = function (data) {
		var name, args;
		data = data || this.data;
		name = data.car;
		args = data.cdr;
		if (/Object/.test(Object.prototype.toString.call(data.car))) {
			return this.run(data.car);
		}
		if (this[data.car] === undefined) {
			this.error("undefined function " + data.car, data.car);
		}
		return this[data.car].call(this, data.cdr);
	}

	Scheme.prototype.define = function (name, fn) {
		this[name] = fn;
		return this;
	}

	Scheme.prototype.builtin = function () {
		this.define('+', function (args) {
			var ret = 0;
			if (/\d+/.test(args.car)) {
				ret += args.car;
			} else if (/\w+/.test(args.car)) {
				ret += this.run(args);
			}
			if (args.cdr !== null) {
				ret += this['+'](args.cdr);
			}
			return ret;
		});
		this.define('-', function (args) {
			var ret = 0;
			if (/\d+/.test(args.car)) {
				ret += args.car;
			} else if (/\w+/.test(args.car)) {
				ret += this.run(args);
			}
			if (args.cdr !== null) {
				ret -= this['-'](args.cdr);
			}
			return ret;
		});
		this.define('*', function (args) {
			var ret = 0;
			if (/\d+/.test(args.car)) {
				ret += args.car;
			} else if (/\w+/.test(args.car)) {
				ret += this.run(args);
			}
			if (args.cdr !== null) {
				ret *= this['*'](args.cdr);
			}
			return ret;
		});
		this.define('/', function (args) {
			var ret = 0;
			if (/\d+/.test(args.car)) {
				ret += args.car;
			} else if (/\w+/.test(args.car)) {
				ret += this.run(args);
			}
			if (args.cdr !== null) {
				ret /= this['/'](args.cdr);
			}
			return ret;
		});
		this.define('cons', function () {
			return {car: this.data.cdr.car, cdr: this.data.cdr.cdr};
		});
		this.define('list', function (data) {
			data = data || this.data;
			return {car: data.cdr.car, cdr: list(data.cdr.cdr)};
		});
	}

	this.Scheme = Scheme;

}).call(this);
