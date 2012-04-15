#! /usr/bin/env node

var Test = require('../lib/test.js').Test;
var Wark = require('../lib/wark.js').Wark;

Test.run(function () {
	Wark.run("abcdefg", function (w) {
		ok("start", w.ch, 'a');
		ok("next", w.next('a'), 'b');
		ok("ch", w.ch, 'b');
		ok("next", w.next(), 'c');
		ok("ch", w.ch, 'c');
		ok("next", w.next(), 'd');
		ok("ch", w.ch, 'd');
		ok("next", w.next(), 'e');
		ok("ch", w.ch, 'e');
		ok("next", w.next(), 'f');
		ok("ch", w.ch, 'f');
		ok("next", w.next(), 'g');
		ok("ch", w.ch, 'g');
	});
});

