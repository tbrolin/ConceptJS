if (typeof require !== 'undefined') {
  var unIts = require('./un.units');
}

unIts.define('units.promise', [], function () {
  var API = {},
    isObject = unIts.utils.isObject,
    isFunction = unIts.utils.isFunction;
    isThenable = function (obj) {
      return ( (isObject(obj) ||  isFunction(obj)) && isFunction(obj.then) );
    }
    async = setTimeout;

  API.defer = function () {
    // console.log('1. Creating a deferred.');
    var deferAPI = {},
      stoned = 'pending',
      on = {},
      resolution;

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

        if (stoned) {
          rocknroll();
        }

        return deferred.promise;
      }
    };

    var rocknroll = function () {
      // console.log('Rock n Roll.');
      async(function () {
        if ('resolved' === stoned && on.resolve) {
          on.resolve(resolution);
          on.resolve = undefined;
        } else if ('rejected' === stoned && on.reject) {
          on.reject(resolution);
          on.reject = undefined;
        }
      });
    };

    var resolver = function (value, resolutionType) {
      // console.log(promise);
      if (deferAPI.promise === value) {
        throw new TypeError();
      } else if (value && value.isaunitspromise) {
        // console.log(deferAPI.promise.then);
        value.then(function (v) {
          resolution = v;
          stoned = 'resolved';
          if (on.resolve) {
            rocknroll();
          }
        }, function (r) {
          resolution = r;
          stoned = 'rejected';
          if (on.reject) {
            rocknroll();
          }
        });
      } else if (isThenable(value)) {

      } else {
        resolution = value;
        stoned = resolutionType;
        if (on.resolve || on.reject) {
          rocknroll();
        }
      }
    };

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

    return deferAPI;
  };
  return API;
});
