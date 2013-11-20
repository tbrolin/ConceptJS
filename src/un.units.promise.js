var require = require || undefined;

if (typeof require !== 'undefined') {
  var unIts = require('./un.units');
}

unIts.define('units.promise', [], function () {
  var API = {}, promises = {};

  /**
  /* Creates and returnes a { resolve, reject, promise }
   */
  API.defer = function () {
    var deferAPI = {}, on = {}, complete = false, resolution, rejection;

    // console.log('DEBUG: CREATE);
    // Unleash the execution chain reaction
    function fire () {
      var emitValue = rejection || resolution;
      var typeOfEmit;
      if (rejection) {
        typeOfEmit = 'Reject';
      } else if (resolution) {
        typeOfEmit = 'Resolve';
      } else {
        typeOfEmit = 'Eh, Unknown';
      }
      var emitter = resolution ? on.resolved : on.rejected;
      if (emitValue && emitValue.then && unIts.utils.isFunction(emitValue.then)) {
        // case is promise
        emitValue.then(on.resolved, on.rejected);
      } else {
        setTimeout(function () {
          // console.log('DEBUG: ' + typeOfEmit + ' firing with value ' + emitValue);
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
      // console.log('DEBUG: RESOLVE');
      if (on.resolved) {
        // console.log('DEBUG: RESOLVE-EMIT');
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
      // console.log('DEBUG: REJECT');
      if (on.rejected) {
        // console.log('DEBUG: REJECT-EMIT');
        fire();
      }
    };

    deferAPI.promise = {
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
                deferred.reject(new TypeError()) :
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
                deferred.reject(new TypeError()) :
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