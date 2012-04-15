var p, pp, util, DEBUG;
util = require('util');

p = function () {
	if (DEBUG) {
		console.log('\n# p');
		console.log(util.inspect(Array.prototype.slice.call(arguments), true, 8));
		console.log();
	}
};

pp = function (obj) {
	if (DEBUG) {
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0, it; (it = args[i]); i++) {
			console.log('\n# pp');
			console.log(util.inspect(it, false, 3));
		}
		console.log();
	}
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
		var next, white, string, value, cons, ch, at, self;

		next = function (c) {
			if (c && c !== ch) {
				this.error("Expected '" + c + "' instead of '" + ch + "'");
			}
			ch = self.src.charAt(at);
			at += 1;
			return ch;
		}

		white = function () {
			while (ch && ch <= ' ') {
				next();
			}
		};

		string = function () {
			var string = '';
			while (ch) {
				if (ch !== ' ' && ch !== ')') {
					string += ch;
				} else {
					white();
					if (Scheme.isNumber(string)) {
						return +string;
					} else {
						return string;
					}
				}
				next();
			}
			this.error("string");
		}

		value = function () {
			var car, cdr;
			car = '';

			if (ch) {
				if (ch === '(') {
					car = cons();
					cdr = value();
				} else if (ch === ')') {
					next();
					white();
					return null;
				} else {
					car = string();
					cdr = value();
				}

				return {
					car: car,
					cdr: cdr
				}
			}
			return null;
		};

		cons = function () {
			next('(');
			return {
				car: string(),
				cdr: value()
			};
		};

		self = this;
		ch = self.src.charAt(0);
		at = 1;

		return cons();
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
		data = data || this.data;
		if (this[data.car] === undefined) {
			this.error("undefined function " + data.car, data.car);
		}
		return this[data.car].call(this, data.cdr);
	}

	Scheme.prototype.define = function (name, fn) {
		this[name] = fn;
		return this;
	};
	Scheme.prototype.math = function (args, fn) {
		while (args.cdr) {
			if (Scheme.isNumber(args.car)) {
			} else if (Scheme.is(/Object/, args.car)) {
				args.car = this.run(args.car);
			} else {
				this.error("Bad args", args);
			}

			if (Scheme.isNumber(args.cdr.car)) {
			} else if (Scheme.is(/Object/, args.cdr.car)) {
				args.cdr.car = this.run(args.cdr.car);
			} else {
				this.error("Bad args", args);
			}

			args.cdr.car = fn(args.car, args.cdr.car);
			args = args.cdr;
		}
		return args.car;
	};

	Scheme.prototype.builtin = function () {
		this.define('+', function (args) {
			if (args == null) {
				return 0;
			}
			return this.math(args, function(a, b){ return a + b; });
		});
		this.define('-', function (args) {
			if (args == null) {
				this.error("'-' arguments need more than one");
			}
			return this.math(args, function(a, b){ return a - b; });
		});
		this.define('*', function (args) {
			if (args == null) {
				return 1;
			}
			return this.math(args, function(a, b){ return a * b; });
		});
		this.define('/', function (args) {
			if (args == null) {
				this.error("'/' arguments need more than one");
			}
			return this.math(args, function(a, b){ return a / b; });
		});

		this.define('cons', function (args) {
			return {car: args.car, cdr: args.cdr};
		});
		// TODO
		this.define('list', function (data) {
			data = data || this.data;
			return {car: data.cdr.car, cdr: list(data.cdr.cdr)};
		});
	}

	Scheme.is = function (reg, obj) {
		return reg.test(Object.prototype.toString.call(obj));
	};

	Scheme.isNumber = function (obj) {
		return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?$/.test(obj);
	};

	this.Scheme = Scheme;

}).call(this);
