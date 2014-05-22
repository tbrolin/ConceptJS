concept.define('concept.dosoon', [], function () {
  var doSoons = [],
      errors = [],
      IPI = {},
      API = {};

  IPI.otherTimes = function (fn) {
    doSoons.push (fn);
  };

  IPI.firstTime = function (fn) {
    this.doSoon = IPI.otherTimes.bind (this);
    doSoons.push (fn);
    setTimeout (IPI.flush.bind (this), 0);
  };

  IPI.flush = function () {
    var funcs = doSoons;
    doSoons = [];
    this.doSoon = IPI.firstTime.bind (this);
    while (funcs.length) {
      var fn = funcs.pop();
      try {
        fn ();
      } catch (err) {
        errors.push ({ 'origin': fn, 'error': err });
      }
    }
  };

  API.doSoon = IPI.firstTime.bind (API);
  API.errors = function () { return errors; };

  return API;

});
