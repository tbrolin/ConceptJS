if (typeof window === 'undefined') {
  var unIts = require('./un.units');
  var asap = require('asap');
}

unIts.define('units.promise', [], function () {
  var API = {},
    isObject = unIts.utils.isObject,
    isFunction = unIts.utils.isFunction;
    isThenable = function (obj) {
      return ( (isObject(obj) ||  isFunction(obj)) );
    };
    async = asap || function (fn) { setTimeout(fn, 0); };

  API.defer = function () {
    // console.log('1. Creating a deferred.');
    var deferAPI = {},
      stoned = 'pending',
      on = {},
      resolution;

    deferAPI.resolve = function (value) {
      if ('pending' !== stoned) {
        return;
      }
      resolver (value, 'resolved');
    };

    deferAPI.reject = function (reason) {
      if ('pending' !== stoned) {
        return;
      }
      resolver (reason, 'rejected');
    };

    deferAPI.promise = {
      isaunitspromise: true,
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
        if ('resolved' === stoned && on.resolve) {
          on.resolve(resolution);
          on.resolve = undefined;
        } else if ('rejected' === stoned && on.reject) {
          on.reject(resolution);
          on.reject = undefined;
        }
    }

    function stone (value, choice) {
      if ('pending' === stoned) {
        resolution = value;
        stoned = choice;
        rocknroll ();
      }
    }

    function resolver (value, resolutionType) {
      if (deferAPI.promise === value) {
        throw new TypeError();
      } else if (isThenable(value)) {
        var then;
        try {
          then = value.then;
        } catch (e) { stone (e, 'rejected'); }
        if (isFunction (then)) {
          (function (then) {
            try {
              var done = false;
              then(function (v) {
                if (done) { return; }
                try {
                  done = true;
                  resolver (v, 'resolved');
                } catch (e) {
                  done = true;
                  resolver (e, 'rejected');
                }
              }, function (r) {
                if (done) { return; }
                try {
                  done = true;
                  resolver (r, 'rejected');
                } catch (e) {
                  done = true;
                  resolver (e, 'rejected');
                }
              });
            } catch (error) {
              if (done) { return; }
              done = true;
              stone (error, 'rejected');
            }
          })(then.bind(value));
        } else {
          stone (value, resolutionType);
        }
      } else {
        stone (value, resolutionType);
      }
    }
    return deferAPI;
  };
  return API;
});
