if (typeof require !== 'undefined') {
  var unIts = require('./un.units');
}

unIts.define('units.promise', [], function () {
  var API = {},
      isObject = unIts.utils.isObject,
      isFunction = unIts.utils.isFunction;
      isThenable = function (obj) {
        return ( (isObject(obj) ||  isFunction(obj)) && isFunction(obj.then) );
      };

  /**
  /* Creates and returnes a { resolve, reject, promise }
   */
  API.defer = function () {
    var deferAPI = {}, on = {}, complete = false, resolution, rejection;

    function fire () {
      // Here we can be sure that promise is resolved/rejected and that
      // on.resolve and on.reject are functions.
      var emitValue = rejection || resolution;

      var emitter = resolution ? on.resolved : on.rejected;

      if (isThenable(emitValue)) {
        emitValue.then.apply(emitValue, [on.resolved, on.rejected]);
        // emitValue.then(on.resolved, on.rejected);
      } else {
        setTimeout(function () {
          emitter(emitValue);
          on.resolved = on.rejected = undefined;
        });
      }
    }

    deferAPI.resolve = function (value) {
      if (complete) {
        // throw 'Promise already resolved or rejected.';
        return;
      }
      resolution = value || true;
      complete = true;
      if (on.resolved) {
        fire();
      }
    };

    deferAPI.reject = function (reason) {
      if (complete) {
        // throw 'Promise already resolved or rejected';
        return;
      }
      rejection = reason || true;
      complete = true;
      if (on.rejected) {
        fire();
      }
    };

    deferAPI.promise = {
      isAUnitsPromise: true,
      then: function (onresolve, onreject) {
        var deferred = API.defer (), legacy;

        if (!unIts.utils.isFunction(onreject)) {
          onreject = function (value) { return value; };
        }
        if (!unIts.utils.isFunction(onresolve)) {
          onresolve = onreject;
        }

        legacy = {
          onresolve: on.resolved,
          onreject: on.rejected
        };

        on.resolved = function (value) {
          if (legacy.onresolve) {
            legacy.onresolve(value);
          }
          setTimeout(function () {
            try {
              var nextValue = onresolve(value);
              (nextValue === deferred.promise) ?
                deferred.reject(new TypeError('Cannot return x from x.then')) :
                deferred.resolve(nextValue);
            } catch (error) {
              deferred.reject(error);
            }
          });
        };

        on.rejected = function (reason) {
          if (legacy.onreject) {
            legacy.onreject(reason);
          }
          setTimeout(function () {
            try {
              var nextValue = onreject(reason);
              (nextValue === deferred.promise) ?
                deferred.reject(new TypeError('Cannot return x from x.then')) :
                deferred.resolve(nextValue);
            } catch (error) {
              deferred.reject(error);
            }
          });
        };

        if (complete) {
          fire ();
        }

        return deferred.promise;
      }
    };
    return deferAPI;
  };
  return API;
});