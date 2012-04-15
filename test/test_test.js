#! /usr/bin/env node

var Test = require('../lib/test.js').Test;

Test.run(function () {
	ok("in run ok", 1, 1);
	is("in run is", {a:1, b:1}, {a:1, b:1});
});

Test.ok("before define ok", 1, 1);
Test.is("before define is", {a:1, b:1}, {a:1, b:1});

Test.define();
ok("after define ok", 1, 1);
is("after define is", {a:1, b:1}, {a:1, b:1});
