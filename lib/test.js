var util = require('util');

var Test = function(){};

Test.run = function (callback, t) {
	if (t) {
		try {
			Test.define();
			callback();
			Test.destroy();
		} catch (ex) {
			Test.exeption = ex;
		}
	} else {
		Test.define();
		callback();
		Test.destroy();
	}
	return Test;
};

Test.ok = function (name, l, r) {
	if (l === r) {
		console.log(name + " -> " + l + "  :ok");
	} else {
		console.log(name + " -> #####  ng  #####");
		console.log("# " + l);
		console.log("# " + r);
	}
};

Test.is = function (name, got, expected) {
	if (JSON.stringify(got) === JSON.stringify(expected)) {
		console.log(name + " -> is ok");
	} else {
		console.log(name + " -> not ok");
		console.log("# " + util.inspect(got, true, 5));
		console.log("# " + util.inspect(expected, true, 5));
	}
};

Test.p = function () {
	console.log('\n# p');
	console.log(Array.prototype.slice.call(arguments));
	console.log();
};

Test.pp = function (obj) {
	console.log('\n# pp');
	console.log(util.inspect(obj, true, 5));
	console.log();
};

Test.error = function (callback) {
	if (Test.exeption) {
		callback(Test.exeption);
	}
};

Test.define = function () {
	var obj = (function () { return this; })();
	for (var key in Test) if (Test.hasOwnProperty(key)) {
		obj[key] = Test[key];
	}
	return Test;
};

Test.destroy = function () {
	var obj = (function () { return this; })();
	for (var key in Test) if (Test.hasOwnProperty(key)) {
		delete obj[key];
	}
	return Test;
};

this.Test = Test;
