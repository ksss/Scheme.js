#! /usr/bin/env node

var util = require('util');
var Scheme = require('../lib/scheme.js').Scheme;
var Test = require('../lib/test.js').Test;

Test.run(function () {
	var it = function (name, src, ans) {
		var scm = new Scheme(src);
		ok(name + " " + src, scm.eval(), ans);
	}

	it("simple", "(define TEST 10) (+ TEST 2)", 12);
	it("space, tab, and feed line", "(define   TEST 10)\n(+ TEST	2)", 12);
	// TODO it("lambda", "(define pow (lambda (x) (* x x))) (pow 3)", 9)
}, 1).error(function(ex){
	console.log(ex);
});
