module ('concept.dosoon');

test('The unit dosoon exists.', function () {
  var unit = concept('concept.dosoon');
  ok (unit.doSoon, 'The unit does have doSoon property.');
});

asyncTest('doSoons should fire sooner', function () {
  var unit = concept ('concept.dosoon');
  var invariant = true;
  unit.doSoon (function () {
    ok (true, 'Was executed later.');
    invariant = false;
    start ();
  });

  unit.doSoon (function () {
    ok (true, 'Was executed later.');
    invariant = false;
    start();
  });
  stop();

  ok (invariant, 'Invariant is not affected.');
});

asyncTest('Nested doSoons should fire even sooner.', function () {
  var unit = concept('concept.dosoon');
  var invariant = true;

  unit.doSoon(function () {
    ok(invariant, "Invariant is not infected.");
    unit.doSoon(function () {
      ok (true, 'Was executed later.');
      invariant = false;
      start();
    });
  });

  ok (invariant, 'Invariant is not infected.');
});
