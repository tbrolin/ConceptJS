module('units.promise');

asyncTest('Resolving a promise', function () {
  var q = unIts('units.promise');

  function promiseReturningFunction(value) {
    var deferred = q.defer();
    // setTimeout(function () {
    deferred.resolve(value);
    //  start();
    // }, 100);
    return deferred.promise;
  }
  var result = 'A';
  promiseReturningFunction('B')
  .then(function (value) {
    result += value;
    return 'C';
  })
  .then(function (value) {
    result += value;
    ok(result === 'ABC', 'Promises resolved.');
  });

  ok (result === 'A', 'Result not yet updated.');
  setTimeout(function () {
    ok(result === 'ABC', 'Result updated after a while.');
    start();
  }, 200);

});