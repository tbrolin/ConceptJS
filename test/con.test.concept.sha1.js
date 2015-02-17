module('SHA1');

test('Get SHA1', 1, function () {
  var sha1 = concept('SHA1');
  ok(sha1.digest, 'Digest function exist.');
});

test('Sha1 digest', function () {
  var hash = '0a4d55a8d778e5022fab701977c5d840bbc486d0';
  var sha1 = concept('SHA1');
  ok (sha1.digest('Hello World') === hash, 'Digested "Hello World"');
});
