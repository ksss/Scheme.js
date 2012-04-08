#! /usr/bin/env node 

var files = [
	'./test_perse.js',
	'./test_math.js'
];

for (var i = 0, len = files.length; i < len; i++) {
	console.log("### " + files[i]);
	require(files[i]);
	console.log();
}
