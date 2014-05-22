var unIts = require('../src/un.units');
require('../src/un.units.promise');

var p = unIts('units.promise');

exports.deferred = p.defer;
