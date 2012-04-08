#! /usr/bin/env node

var util = require('util');
var Scheme = require('../lib/scheme.js').Scheme;

var run = function () {
	var scm;

	var it = function (name, src, ans) {
		var scm = new Scheme(src);
		test.ok(name + " " + src, scm.run(), ans);
	}
		
	it("simple plus", "(+ 1 2)", 3);
	it("one nesting ", "(+ (+ 3 4) 1)", 8);
	it("multiple nest ", "(+ 1 (+ 2 (+ 3 (+ 4 5))))", 15);
	it("serial list ", "(+ 1 2 3 4 5)", 15);
	it("nest and serial ", "(+ (+ 3 4) (+ 5 6) (+ 0 9))", 27);
	it("simple plus", "(/ 4 2)", 2);
	it("one nesting ", "(- (* 3 4) 1)", 11);
	it("multiple nest ", "(* 1 (/ 2 (+ 3 (- 4 5))))", 1); // TODO
	it("serial list ", "(* 1 2 3 4 5)", 120);
	it("nest and serial ", "(/ (* 3 4) (- 5 2) (+ 0 2))", 2); // TODO
};

var test = new function () {
	this.ok = function (name, l, r) {
		if (l === r) {
			console.log(name + " -> \'" + l + "\' ok");
		} else {
			console.log(name + " -> not ok");
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
	nn(5);
}
