module('units.promise');

test('Resolving a promise is async.', function () {
  var invariant = 'Untouched';

  var when = function (value) {
    var deferred = unIts('units.promise').defer();
    deferred.resolve(value);
    ok('Untouched' === invariant, 'Invariant is intact after resolving.');
    return deferred.promise;
  };

  when('A').then (function (value) {
    invariant = 'Touched';
  });

  ok ('Untouched' === invariant, 'Invariant is intact at bottom of execution.');
});

asyncTest('Resolving a promise with values.', function () {

  var when = function (value) {
    var deferred = unIts('units.promise').defer();
    deferred.resolve(value);
    return deferred.promise;
  };

  var promiseA = when('A');
  // 1
  ok (typeof promiseA.then !== 'undefined', 'Promise has then.');

  var promiseB = promiseA.then(function (value) {
    // 2
    ok(value === 'A', 'PromiseA resolved with A.');
    start();
    return 'B';
  });
  stop();
  var promiseC = promiseA.then(function (value) {
    // 3
    ok(value === 'A', 'PromiseA resolved with A again.');
    start();
    return 'C';
  });
  stop();
  promiseB.then(function (value) {
    // 4
    ok(value === 'B', 'PromiseB resolved with B.');
    start();
  });
  stop();
  promiseC.then(function (value) {
    // 5
    ok(value === 'C', 'PromiseC resolved with B.');
    start();
  });
  stop();
  when('A')
  .then(function (value) {
    // 6
    ok('A' === value, 'Promise resolved with A in chained.');
    start();
    return 'B';
  })
  .then(function (value) {
    // 7
    ok('B' === value, 'Promise resolved with B in chained.');
    start();
    return 'C';
  })
  .then(function (value) {
    // 8
    ok('C' === value, 'Promise resolved with C in chained.');
    start();
  });
  stop();
  stop();
  stop();
});

asyncTest('Resolve promise with another promise.', function () {

  var when = function (value) {
    var deferred = unIts('units.promise').defer();
    deferred.resolve(value);
    return deferred.promise;
  };

  var promiseA = when('A');

  when(promiseA).then(function (value) {
    ok ('A' === value, 'Promise resolved with value of promiseA');
    start();
  });

});

asyncTest('Ordering nested promise onresolve functions.', function () {
  var when = function (value) {
    var deferred = unIts('units.promise').defer();
    deferred.resolve(value);
    return deferred.promise;
  };

  var promise = when('A');
  var correctThenWasFinishedFirst = false;
  promise.then(function (value) {
    promise.then(function (value) {
      ok (correctThenWasFinishedFirst, 'Insider.');
      start();
    });
    stop();
    correctThenWasFinishedFirst = true;
    ok('A' === value, 'Otsider');
    start();
  });
  // stop();
});

asyncTest('Ordering nested promise onreject functions.', function () {
  var when = function (value) {
    var deferred = unIts('units.promise').defer();
    deferred.reject(value);
    return deferred.promise;
  };

  var promise = when('A');
  var correctThenWasFinishedFirst = false;
  promise.then(null, function (value) {
    promise.then(null, function (value) {
      ok (correctThenWasFinishedFirst, 'Insider.');
      start();
    });
    stop();
    correctThenWasFinishedFirst = true;
    ok('A' === value, 'Otsider');
    start();
  });
  // stop();
});