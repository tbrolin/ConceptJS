/**
 * Produce tap output if possible.
 *
if (qunitTap) {
  qunitTap(QUnit, function() { console.log.apply(console, arguments); });
}*/
module('ConceptJS');

test('Getting the version.', 1, function () {
  ok (concept() === '0.1.0', 'The version is 0.1.0.');
});

test('Obtain non-existing concept should throw', 2, function () {
  var err;
  throws(function () {
    try {
      concept('noConcept');
    } catch (err) {
      ok (err.type === 'CONCEPT-NOT-FOUND');
      throw (err);
    }
  }, 'Error thrown.');
});

test('Defining named concepts.', function () {
  concept.define('A');
  ok (typeof concept('A') === 'object', 'Named concept defines returns empty object.');

  concept.define('B', ['A']);
  ok (typeof concept('B') === 'object', 'Named concept with dependency returns an empty object.');

  concept.define('C', function () { return 'Hello'; });
  ok (concept('C') === 'Hello', 'Named concept with no dependency defined and used.');

  concept.define('D', ['C'], function () { return concept('C'); });
  ok (concept('D') === 'Hello', 'Named unit with dependency defined and used.');
});

test('Defining anonymous concepts.', function () {
  concept.define('aDependencyConcept');

  var a = concept.define();
  ok ((a.scope && a.fn && a.deps), 'Anonymous concept defined.');
  ok (typeof concept(a) === 'object', 'Anonymous concept resolved to empty object.');

  var b = concept.define(['aDependencyConcept']);
  ok ((b.scope && b.fn && b.deps), 'Anonymous concept with dependency defined.');
  ok (typeof concept(b) === 'object', 'Anonymous concept with dependency resolved to empty object.');

  var c = concept.define(function () { return 'Hello'; });
  ok ((c.scope && c.fn && c.deps), 'Anonymous concept with body defined.');
  ok (concept(c) === 'Hello', 'Anonymous concept with body resolved.');

  var d = concept.define(['aDependencyConcept'], function () { return 'Hello' });
  ok ((d.scope && d.fn && d.deps), 'Anonymous concept with dependency and body defined.');
  ok (concept(d) === 'Hello', 'Anonymous concept with dependency and body resolved.');
});

test('Defining and using concepts.', function () {
  concept.define('math.adder', [], function () {
    var total = 0,
        self = this;

    if (!this.unit.totallyTotal) {
      this.unit.totallyTotal = 0;
    }

    var API = function (a, b) {
      var c = a + b;
      self.unit.totallyTotal += c;
      total += c;
      return c;
    };

    API.total = function () { return total; };
    API.totallyTotal = function () { return self.unit.totallyTotal; };
    return API;
  });

  var adderA = concept('math.adder');
  var adderB = concept('math.adder');
  ok (adderA(2, 4) === 6, 'Defined and used a concept.');
  ok (adderA(3, 1) === 4, 'Used it again...');
  ok (adderA.total() === 10, '...and again.');
  ok (adderB(2, 3) === 5, 'Using same concept but different.')
  ok (adderB.total() === 5, 'We are using independent instances of the concept.');
  ok (adderA.totallyTotal() === 15, 'They can access a shared scope.');

});
