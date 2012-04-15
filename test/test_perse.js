#! /usr/bin/env node

var util = require('util');
var Scheme = require('../lib/scheme.js').Scheme;
var Test = require('../lib/test.js').Test;

Test.run(function () {
	var it = function (name, src, ans) {
		var scm = new Scheme(src);
		is(name + " " + src, scm.perse(), ans);
	}

	it("single", "(+)", {
		car: '+',
		cdr: null
	});

	it("simple perse ", "(cons 1  2)", {
		car: "cons",
		cdr: {
			car: 1,
			cdr: {
				car: 2,
				cdr: null,
	}}});

	it("one nesting ", "(cons (list 3 4) 1)", {
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

	it("more nest", "(+ (+ 6 (+ 1 2)) 4)", {
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


	it("multiple nest", "(a 1 (b 2 (c 3 (d 4 5))))", {
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

	it("serial list", "(list 1 2 3 4 5)", {
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
	
	it("nest and serial", "(foo (bar 3 4) (baz 5 6) (hoge 0 9))", {
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
});
