if (typeof window === 'undefined') {
  var unIts = require('./un.units');
}

unIts.define('units.promise', [], function () {
  var API = {},
    isObject = unIts.utils.isObject,
    isFunction = unIts.utils.isFunction;
    isThenable = function (obj) {
      return ( (isObject(obj) ||  isFunction(obj)) && isFunction(obj.then) );
    };
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

    var stone = function (value, choice) {
      if ('pending' === stoned) {
        resolution = value;
        stoned = choice;
        var roller = choice === 'rejected' ? on.reject : on.resolve;
        if (roller) {
          rocknroll ();
        }
      }
    };

    var resolver = function (value, resolutionType) {
      if (deferAPI.promise === value) {
        stone (new TypeError(), 'rejected');
      } else if (value && value.isaunitspromise) {
//        deferAPI.promise.then.apply
        value.then.apply(value, [function (v) {
          stone (v, 'resolved');
        }, function (r) {
          stone (r, 'rejected');
        }]);
      } else if (isThenable(value)) {
        (function (then) {
          try {
            var isResolved = false;
            then.apply(value, [function (v) {
              if (!isResolved) {
                try {
                  resolver(v, 'resolved');
                  isResolved = true;
                } catch (e) {
                  stone (e, 'rejected');
                  isResolved = true;
                }
              }
            }, function (r) {
              if (!isResolved) {
                try {
                  resolver(r, 'rejected');
                  isResolved = true;
                } catch (e) {
                  stone (e, 'rejected');
                  isResolved = true;
                }
              }
            }]);
          } catch (error) {
            if (!isResolved) {
              isResolved = true;
              stone (error, 'rejected');
            }
          }
        })(value.then);
      } else {
        stone (value, resolutionType);
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
