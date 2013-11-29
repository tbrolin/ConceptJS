if (typeof window === 'undefined') {
  var unIts = require('./un.units');
  var asap = require('asap');
}

unIts.define('units.promise', [], function () {
  var API = {},
    isObject = unIts.utils.isObject,
    isFunction = unIts.utils.isFunction,
    isThenable = function (obj) {
      return ( (isObject(obj) ||  isFunction(obj)) );
    },
    async = asap || function (fn) { setTimeout(fn, 0); };

  API.defer = function () {
    // console.log('1. Creating a deferred.');
    var deferAPI = {},
      state = 'pending',
      on = {},
      resolution;

    deferAPI.resolve = function (value) {
      if ('pending' !== state) {
        return;
      }
      resolver (value, 'resolved');
    };

    deferAPI.reject = function (reason) {
      if ('pending' !== state) {
        return;
      }
      resolver (reason, 'rejected');
    };

    deferAPI.promise = {
      then: function (onresolve, onreject) {

        var deferred = API.defer();

        if (!isFunction (onreject)) {
          onreject = function (value) { return value; };
        }
        if (!isFunction (onresolve)) {
          onresolve = onreject;
        }

        var legacy = {
          onresolve: on.resolve,
          onreject: on.reject
        };

        on.resolve = function (value) {
          if (legacy.onresolve) {
            legacy.onresolve (value);
          }
          async (function () {
            try {
              deferred.resolve (onresolve (value));
            } catch (error) {
              deferred.reject(error);
            }
          });
        };

        on.reject = function (reason) {
          if (legacy.onreject) {
            legacy.onreject (reason);
          }
          async (function () {
            try {
              deferred.resolve (onreject (reason));
            } catch (error) {
              deferred.reject(error);
            }
          });
        };

        rocknroll();

        return deferred.promise;
      }
    };

    function rocknroll () {
        if ('resolved' === state && on.resolve) {
          on.resolve(resolution);
          on.resolve = undefined;
        } else if ('rejected' === state && on.reject) {
          on.reject(resolution);
          on.reject = undefined;
        }
    }

    function stone (value, choice) {
      if ('pending' === state) {
        resolution = value;
        state = choice;
        rocknroll ();
      }
    }

    function resolver (value, resolutionType) {
      var done = false;
      try {
        if (deferAPI.promise === value) {
          throw new TypeError();
        }

        if (isThenable(value)) {
          var then = value.then;
          if (isFunction (then)) {
            then.apply(value, [function (v) {
              if (done) { return; }
              resolver (v, 'resolved');
              done = true;
            }, function (r) {
              if (done) { return; }
              resolver (r, 'rejected');
              done = true;
            }]);
            return;
          }
        }

        stone (value, resolutionType);
        done = true;
      } catch (e) {
        if (!done) {
          stone (e, 'rejected');
          done = true;
        }
      }
    }
    return deferAPI;
  };
  return API;
});
