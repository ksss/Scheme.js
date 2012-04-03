#! /usr/bin/env node

var util = require('util');
var Scheme = require('../scheme.js').Scheme;
var scm = new Scheme();

var run = function () {
	var ret, code;

	code = "(cons 1  2)";
	ret = scm.perse(code);
	test.is("simple perse " + code, ret, {
		car: "cons",
		cdr: {
			car: 1,
			cdr: {
				car: 2,
				cdr: null,
	}}})

	code = "(cons (list 3 4) 1)";
	ret = scm.perse(code);
	test.is( "one nesting " + code, ret, {
		car: "cons",
		cdr: {
			car: {
				car: "list",
				cdr: {
					car: 3,
					cdr: {
						car: 4,
						cdr: null,
					},
				},
			},
			cdr: {
				car: 1,
				cdr: null,
	}}});

	code = "(a 1 (b 2 (c 3 (d 4 5))))"
	ret = scm.perse(code);
	test.is("multiple nest " + code, ret, {
		car: 'a',
		cdr: {
			car: 1,
			cdr: {
				car: 'b',
				cdr: {
					car: 2,
					cdr: {
						car: 'c',
						cdr: {
							car: 3,
							cdr: {
								car: 'd',
								cdr: {
									car: 4,
									cdr: {
										car: 5,
										cdr: null,
	}}}}}}}}});

	code = "(list 1 2 3 4 5)";
	ret = scm.perse(code);
	test.is("serial list " + code, ret, {
		car: "list",
		cdr: {
			car: 1,
			cdr: {
				car: 2,
				cdr: {
					car: 3,
					cdr: {
						car: 4,
						cdr: {
							car: 5,
							cdr: null,
	}}}}}});
	
	code = "(foo (bar 3 4) (baz 5 6) (hoge 0 9))";
	ret = scm.perse(code);
	test.is("nest and serial", ret, {
		car: 'foo',
		cdr: {
			car: {
				car: 'bar',
				cdr: {
					car: 3,
					cdr: {
						car: 4,
						cdr: null,
					}
				}
			},
			cdr: {
				car: {
					car: 'baz',
					cdr: {
						car: 5,
						cdr: {
							car: 6,
							cdr: null,
						}
					}
				},
				cdr: {
					car: 'hoge',
					cdr: {
						car: 0,
						cdr: {
							car: 9,
							cdr: null,
	}}}}}});
};

var test = new function () {
	this.ok = function (name, l, r) {
		if (l === r) {
			console.log(name + " -> ok");
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
	return console.log(Array.prototype.slice.call(arguments));
};

var pp = function (obj) {
	return console.log(util.inspect(obj, true, null));
};

try {
	run();
} catch (ex) {
	console.log(ex);
}
