#! /usr/bin/env node

var Scheme = require('../lib/scheme.js').Scheme;
var Test = require('../lib/test.js').Test;

Test.run(function () {
	var it = function (name, src, ans) {
		var scm = new Scheme(src);
		ok(name + " " + src, scm.run(), ans);
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
	it("one nesting", "(+ (+ 3 4) 3)", 10);
	it("one nesting", "(- (- 3 4) 3)", -4);
	it("one nesting", "(* (* 3 4) 3)", 36);
	it("one nesting", "(/ (/ 3 4) 3)", 0.25);
	it("multiple nest", "(+ 1 (+ 8 (+ 9 (+ 10 11))))", 39);
	it("multiple nest", "(- 1 (- 2 (- 3 (- 4 5))))", 3);
	it("multiple nest", "(* 1 (* 2 (* 3 (* 4 5))))", 120);
	it("multiple nest", "(/ 1 (/ 2 (/ 3 (/ 4 5))))", 1.875);
	it("serial list", "(+ 1 2 3 4 5)", 15);
	it("serial list", "(- 1 2 3 4 5)", -13);
	it("serial list", "(* 1 2 3 4 5)", 120);
	it("serial list", "(/ 16 8 4 2 1)", 0.25);
	it("nest and serial", "(+ (+ 3 4) (+ 5 6) (+ 1 9))", 28);
	it("nest and serial", "(- (- 3 4) (- 5 6) (- 1 9))", 8);
	it("nest and serial", "(* (* 3 4) (* 5 6) (* 1 9))", 3240);
	it("nest and serial", "(/ (/ 3 4) (/ 5 6) (/ 1 9))", 8.1);
	it("multiple nest", "(* 1 (/ 2 (+ 3 (- 4 5))))", 1);
	it("deep nest", "(+ (+ (/ (- 20 -5 7) 3) (+ 1 (+ 1 (/ (* (+ 2 0 (* 999 0)) 3 1) 3 2)))) 4)", 13);
	it("full", "(- (* (+ 1e+3 9) (/ 8 (/ 5 .1 1e+1) 1e-1) (- 41 (* 2 (+ 1) 3) 8 (+ 2 3 4))) (- 5 2) (+ 0 2) 1 2 3 4 5 5 (/ .6 .1))", 290561);
	it("big num", "(* 1e+1 1e+41)", 1e+42);

	ok("double cons", (new Scheme()).eval("(+ 300 10) (+ 1 2)"), 3);

}, true).error(function(ex){
	console.log(ex);
});
