var concept = require('../src/con.concept');
require('../src/con.concept.promise');

var p = concept('concept.promise');

exports.deferred = p.defer;
