module('concept.uuid');

test('Generate a uuid', function () {
  var uuid = concept('concept.uuid');

  var unique = uuid.generate();
  ok (unique, unique + ' was generated.');
});

test('Generations are unique.', function () {
  var uuid = concept('concept.uuid'), uniques = [];

  var assertUnique = function (isUnique) {
    ok (uniques.indexOf(isUnique) === -1, 'Going strong!');
  };

  var unique = uuid.generate();

  for (var i = 0; i < 1000; i++) {
    assertUnique(unique);
    uniques.push(unique);
    unique = uuid.generate();
  }
});

test('Generations are uniqe even different instances.', function () {
  var uuid0 = concept('concept.uuid');
  var uuid1 = concept('concept.uuid');
  var uniques = [];

  var assertUnique = function (isUnique) {
    ok (uniques.indexOf(isUnique) === -1, 'Going strong!');
  };

  var unique = uuid0.generate();

  for (var i = 0; i < 2000; i++) {
    assertUnique(unique);
    uniques.push(unique);
    unique = i % 2 ? uuid0.generate() : uuid1.generate();
  }
});
