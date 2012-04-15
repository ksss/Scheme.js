#! /usr/bin/env node

var util = require('util');
var Scheme = require('../lib/scheme.js').Scheme;

var run = function () {
	var it = function (name, src, ans) {
		var scm = new Scheme(src);
		test.ok(name + " " + src, scm.run(), ans);
	}

	it("simple", "(+ 1 2)", 3);
	it("simple", "(- 1 2)", -1);
	it("simple", "(* 1 2)", 2);
	it("simple", "(/ 1 2)", 0.5);
	it("no arguments", "(+)", 0);
	it("no arguments", "(*)", 1);
	it("one arguments", "(+ 1)", 1);
	it("one arguments", "(- 1)", 1);
	it("one arguments", "(* 1)", 1);
	it("one arguments", "(/ 1)", 1);
	it("one nesting ", "(+ (+ 3 4) 3)", 10);
	it("one nesting ", "(- (- 3 4) 3)", -4);
	it("one nesting ", "(* (* 3 4) 3)", 36);
	it("one nesting ", "(/ (/ 3 4) 3)", 0.25);
	it("multiple nest ", "(+ 1 (+ 8 (+ 9 (+ 10 11))))", 39);
	it("multiple nest ", "(- 1 (- 2 (- 3 (- 4 5))))", 3);
	it("multiple nest ", "(* 1 (* 2 (* 3 (* 4 5))))", 120);
	it("multiple nest ", "(/ 1 (/ 2 (/ 3 (/ 4 5))))", 1.875);
	it("serial list ", "(+ 1 2 3 4 5)", 15);
	it("serial list ", "(- 1 2 3 4 5)", -13);
	it("serial list ", "(* 1 2 3 4 5)", 120);
	it("serial list ", "(/ 16 8 4 2 1)", 0.25);
	it("nest and serial ", "(+ (+ 3 4) (+ 5 6) (+ 1 9))", 28);
	it("nest and serial ", "(- (- 3 4) (- 5 6) (- 1 9))", 8);
	it("nest and serial ", "(* (* 3 4) (* 5 6) (* 1 9))", 3240);
	it("nest and serial ", "(/ (/ 3 4) (/ 5 6) (/ 1 9))", 8.1);
	it("multiple nest ", "(* 1 (/ 2 (+ 3 (- 4 5))))", 1);
	it("deep nest", "(+ (+ (/ (- 20 -5 7) 3) (+ 1 (+ 1 (/ (* (+ 2 0 (* 999 0)) 3 1) 3 2)))) 4)", 13);
	it("full ", "(- (* (+ 1e+3 9) (/ 8 (/ 5 .1 1e+1) 1e-1) (- 41 (* 2 (+ 1) 3) 8 (+ 2 3 4))) (- 5 2) (+ 0 2) 1 2 3 4 5 5 (/ .6 .1))", 290561);
	it("big num", "(* 1e+1 1e+41)", 1e+42);
};

var test = new function () {
	this.ok = function (name, l, r) {
		if (l === r) {
			console.log(name + " -> " + l + "  :ok");
		} else {
			console.log(name + " -> #####  ng  #####");
			console.log("# " + l);
			console.log("# " + r);
		}
	};

	this.is = function (name, got, expected) {
		if (JSON.stringify(got) === JSON.stringify(expected)) {
			console.log(name + " -> is ok");
		} else {
			console.log(name + " -> not ok");
			console.log("# " + util.inspect(got, true, 5));
			console.log("# " + util.inspect(expected, true, 5));
		}
	};
};

var p = function () {
	console.log('\n# p');
	console.log(Array.prototype.slice.call(arguments));
	console.log();
};

var pp = function (obj) {
	console.log('\n# pp');
	console.log(util.inspect(obj, true, 3));
	console.log();
};

var nn = function (n) {
	console.log("-");
	if (1 < n)
		arguments.callee(n - 1);
}
try {
	run();
} catch (ex) {
	pp(ex);
}
