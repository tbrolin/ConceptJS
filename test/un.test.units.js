module('units');

test('Getting the version.', 1, function () {
  ok (unIts() === '0.1.0', 'The version is 0.1.0.');
});

test('Obtain non-existing unit should throw', 2, function () {
  var err;
  throws(function () {
    try {
      unIts('noUnit');
    } catch (err) {
      ok (err.type === 'UNIT-NOT-FOUND');
      throw (err);
    }
  }, 'Error thrown.');
});

test('Defining named units.', function () {
  unIts.define('A');
  ok (typeof unIts('A') === 'object', 'Named unit defines returns empty object.');

  unIts.define('B', ['A']);
  ok (typeof unIts('B') === 'object', 'Named unit with dependency returns an empty object.');

  unIts.define('C', function () { return 'Hello'; });
  ok (unIts('C') === 'Hello', 'Named unit with no dependency defined and used.');

  unIts.define('D', ['C'], function () { return unIts('C'); });
  ok (unIts('D') === 'Hello', 'Named unit with dependency defined and used.');
});

test('Defining anonymous units.', function () {
  unIts.define('aDependencyUnit');

  var a = unIts.define();
  ok ((a.scope && a.fn && a.deps), 'Anonymous unit defined.');
  ok (typeof unIts(a) === 'object', 'Anonymous unit resolved to empty object.');

  var b = unIts.define(['aDependencyUnit']);
  ok ((b.scope && b.fn && b.deps), 'Anonymous unit with dependency defined.');
  ok (typeof unIts(b) === 'object', 'Anonymous unit with dependency resolved to empty object.');

  var c = unIts.define(function () { return 'Hello'; });
  ok ((c.scope && c.fn && c.deps), 'Anonymous unit with body defined.');
  ok (unIts(c) === 'Hello', 'Anonymous unit with body resolved.');

  var d = unIts.define(['aDependencyUnit'], function () { return 'Hello' });
  ok ((d.scope && d.fn && d.deps), 'Anonymous unit with dependency and body defined.');
  ok (unIts(d) === 'Hello', 'Anonymous unit with dependency and body resolved.');
});

test('Defining and using units.', function () {
  unIts.define('math.adder', [], function () {
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

  var adderA = unIts('math.adder');
  var adderB = unIts('math.adder');
  ok (adderA(2, 4) === 6, 'Defined and used a unit.');
  ok (adderA(3, 1) === 4, 'Used it again...');
  ok (adderA.total() === 10, '...and again.');
  ok (adderB(2, 3) === 5, 'Using same unit but different.')
  ok (adderB.total() === 5, 'We are using independent instances of unit.');
  ok (adderA.totallyTotal() === 15, 'They can access a shared scope.');

});