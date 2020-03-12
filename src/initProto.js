// [1, 2, 3].last
//
// 3
Object.defineProperty(Array.prototype, 'last', {
	get: function () {
		return this[this.length - 1]
	}
});

// 'the "dog" and "cat" are "blue"'.matchG(/"(\w+)"/)
//
// [ [ '"dog"', 'dog', index: 0, input: '"dog"', groups: undefined ],
//   [ '"cat"', 'cat', index: 0, input: '"cat"', groups: undefined ],
//   [ '"blue"', 'blue', index: 0, input: '"blue"', groups: undefined ] ]
String.prototype.matchG = function (rex) {
	let matches = this.match(RegExp(rex, rex.flags + 'g'));
	return matches ? matches.map(a => a.match(rex) || []) : [[]];
};
