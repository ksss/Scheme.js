#! /usr/bin/env node

var Test = require('../lib/test.js').Test;
var Wark = require('../lib/wark.js').Wark;

Test.run(function () {
	Wark.run("abcdefg", function (w) {
		ok("start", w.ch, 'a');
		ok("next", w.next(), 'b');
		ok("ch", w.ch, 'b');
		ok("next", w.next(), 'c');
		ok("next", w.next(), 'd');
		ok("back", w.back(), 'c');
		ok("back", w.back(), 'b');
		ok("back", w.back(), 'a');
		ok("to", w.to('g'), 'g');
		ok("ch", w.ch, 'g');
	});
});

