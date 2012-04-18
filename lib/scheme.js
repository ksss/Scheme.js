var p, pp, util, Wark, DEBUG = true;
util = require('util');
Wark = require('./wark.js').Wark;

p = function () {
	if (DEBUG) {
		console.log("# p", util.inspect(Array.prototype.slice.call(arguments)));
		console.log();
	}
};

pp = function (obj) {
	if (DEBUG) {
		var args = Array.prototype.slice.call(arguments);
		for (var i = 0, it; (it = args[i]); i++) {
			console.log("# pp", util.inspect(it, true, 7));
		}
		console.log();
	}
};


(function () {
	var Scheme = function () {
		return this.init.apply(this, arguments);
	};

	Scheme.prototype.init = function () {
		this.src = arguments[0];
		this.function = {};
		this.builtin();
		return this;
	};

	// {{{ perse
	Scheme.prototype.perse = function (src) {
		src = src || this.src
		var w, string, value, cons;
		w = new Wark(src);
		string = function () {
			var string = '';
			while (w.ch) {
				if (w.ch !== ' ' && w.ch !== ')') {
					string += w.ch;
				} else {
					w.white();
					if (Scheme.isNumber(string)) {
						return +string;
					} else {
						return string;
					}
				}
				w.next();
			}
			this.error("string");
		}

		value = function () {
			var car, cdr;
			car = '';

			if (w.ch) {
				if (w.ch === '(') {
					car = cons();
					cdr = value();
				} else if (w.ch === ')') {
					w.next();
					w.white();
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
			w.next('(');
			return {
				car: string(),
				cdr: value()
			};
		};

		return cons();
	};
	// }}}

	// {{{ error
	Scheme.prototype.error = function (m, obj) {
		throw {
			src: this.src,
			message: m,
			obj: obj,
		};
	};
	// }}}

	// {{{ eval
	Scheme.prototype.eval = function (src) {
		var w, depth, str, ret;
		src = src || this.src;
		src = src.replace(/[\s\t\n]+/gm, ' ');
		w = new Wark(src);
		depth = 0;
		str = '';
		while (w.ch) {
			str += w.ch;
			if (w.ch === '(') {
				depth += 1;
			} else
			if (w.ch === ')') {
				depth -= 1;
			}

			if (depth === 0) {
				ret = this.run(this.perse(str));
				str = '';
				w.next(')');
			}
			w.next();
		}
		return ret;
	};
	// }}}

	// call first symbol and arguments is cdr
	Scheme.prototype.run = function (data) {
		data = data || this.perse();
		if (this.function[data.car] === undefined) {
			this.error("undefined function " + data.car);
		}
		return this.function[data.car](data.cdr);
	};

	// define new function
	// var scm = new Scheme();
	// scm.define('foo', function (x) {
	//     return 1 + x;
	// });
	// scm.foo(3); // => 4
	Scheme.prototype.define = function (name, fn) {
		this.function[name] = fn;
		return this;
	};

	// {{{ math
	Scheme.prototype.math = function (args, fn) {
		while (args.cdr) {
			if (Scheme.isNumber(args.car)) {
			} else if (Scheme.is(/String/, args.car)) {
				args.car = this.function[args.car];
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
	// }}}

	// {{{ builtin
	Scheme.prototype.builtin = function () {
		var self;
		self = this;

		this.define('+', function (args) {
			if (args == null) {
				return 0;
			}
			return self.math(args, function(a, b){ return a + b; });
		});
		this.define('-', function (args) {
			if (args == null) {
				self.error("'-' arguments need more than one");
			}
			return self.math(args, function(a, b){ return a - b; });
		});
		this.define('*', function (args) {
			if (args == null) {
				return 1;
			}
			return self.math(args, function(a, b){ return a * b; });
		});
		this.define('/', function (args) {
			if (args == null) {
				self.error("'/' arguments need more than one");
			}
			return self.math(args, function(a, b){ return a / b; });
		});

		this.define('define', function (args) {
			if (Scheme.isNumber(args.cdr.car)) {
				self.function[args.car] = args.cdr.car;
			} else {
				self.function[args.car] = self.run(args.cdr.car);
			}
		});

		// TODO
		this.define('lambda', function (args) {
			return function (a, b) {
				return a.car * a.car;
			};
		});

		this.define('cons', function (args) {
			return {car: args.car, cdr: args.cdr};
		});
	}
	// }}}

	Scheme.is = function (reg, obj) {
		return reg.test(Object.prototype.toString.call(obj));
	};

	Scheme.isNumber = function (obj) {
		return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?$/.test(obj);
	};

	this.Scheme = Scheme;

}).call(this);
