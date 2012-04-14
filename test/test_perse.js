#! /usr/bin/env node

var util = require('util');
var Scheme = require('../lib/scheme.js').Scheme;

this.test = test = new function () {
	this.run = function () {
		var scm;

		scm = new Scheme("(+)");
		test.is(scm.src, scm.data, {
			car: '+',
			cdr:null
		});

		scm = new Scheme("(cons 1  2)");
		test.is("simple perse " + scm.src, scm.data, {
			car: "cons",
			cdr: {
				car: 1,
				cdr: {
					car: 2,
					cdr: null,
		}}});
		test.is("function cons", scm.run(), {
			car: 1,
			cdr: {
				car: 2,
				cdr: null
		}});

		scm = new Scheme("(cons (list 3 4) 1)");
		test.is( "one nesting " + scm.src, scm.data, {
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

		scm = new Scheme("(+ (+ 6 (+ 1 2)) 4)");
		test.is( "more nest" + scm.src, scm.data, {
			car: "+",   // 13
			cdr: {
				car: {   // 9
					car: '+',
					cdr: {
						car: 6,
						cdr: {
							car: {  // 3
								car: '+',
								cdr: {
									car: 1,
									cdr: {
										car: 2,
										cdr: null
									}
								}
							},
							cdr: null
						}
					}
				},
				cdr: {
					car: 4,
					cdr: null
				}
			}
		});


		scm = new Scheme("(a 1 (b 2 (c 3 (d 4 5))))");
		test.is("multiple nest " + scm.src, scm.data, {
			car: 'a',
			cdr: {
				car: 1,
				cdr: {
					car: {
						car: 'b',
						cdr: {
							car: 2,
							cdr: {
								car: {
									car: 'c',
									cdr: {
										car: 3,
										cdr: {
											car: {
												car: 'd',
												cdr: {
													car: 4,
													cdr: {
														car: 5,
														cdr: null,
													}
												}
											},
											cdr: null
										}
									}
								},
								cdr: null
							}
						}
					},
					cdr: null
		}}});

		scm = new Scheme("(list 1 2 3 4 5)");
		test.is("serial list " + scm.src, scm.data, {
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
		
		scm = new Scheme("(foo (bar 3 4) (baz 5 6) (hoge 0 9))");
		test.is("nest and serial " + scm.src, scm.data, {
			car: 'foo',
			cdr: {
				car: { // (bar 3 4)
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
					car: { // (baz 5 6)
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
						car: {
							car: 'hoge',
							cdr: {
								car: 0,
								cdr: {
									car: 9,
									cdr: null
						}}},
						cdr: null
					}
				}
			}
		});
	};

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
			console.log("# " + util.inspect(got, true, null));
			console.log("# " + util.inspect(expected, true, null));
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
	console.log(util.inspect(obj, true, null));
	console.log();
};

test.run();
