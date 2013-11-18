if (typeof require !== 'undefined') {
  var unIts = require('./un.units');
}

unIts.define('units.promise', [], function () {
  var API = {};

  /**
  /* Creates and returnes a { resolve, reject, promise }
   */
  API.defer = function () {
    var deferAPI = {}, on = {}, resolution, rejection;

    // Unleash the execution chain reaction
    function emit () {
      var emitValue = rejection || resolution;

      var emitter = resolution ? on.resolved : on.rejected;

      if (emitValue && emitValue.then && unIts.utils.isFunction(emitValue.then)) {
        // case is promise
        emitValue.then(on.resolved, on.rejected);
      } else {
        setTimeout(function () {
          if (unIts.utils.isFunction(emitter)) {
            try {
              emitter (emitValue);
            } catch (error) {
              on.rejected (error);
            }
          }
          on.resolved = null;
          on.rejected = null;
        }, 4);
      }
    }

    deferAPI.resolve = function (value) {
      if (rejection || resolution) {
        // throw 'Promise already resolved or rejected.';
        return;
      }
      resolution = value || true;
      if (on.resolved) {
        emit();
      }
    };

    deferAPI.reject = function (reason) {
      if (rejection || resolution) {
        // throw 'Promise already resolved or rejected';
        return;
      }
      rejection = reason || true;
      if (on.rejected) {
        emit();
      }
    };

    deferAPI.promise = {
      then: function (onresolve, onreject) {
        var deferred = API.defer ();

        if (on.resolved || on.rejected) {
          var predecessor = {};
          predecessor.onresolve = on.resolved;
          predecessor.onreject = on.rejected;
        }

        on.resolved = function (value) {
          if (predecessor && unIts.utils.isFunction(predecessor.onresolve)) {
            predecessor.onresolve(value);
          }

          try {
            if (!unIts.utils.isFunction(onresolve)) {
              onresolve = function () {};
            }
            var nextValue = onresolve(value);
            onresolve = null;
          } catch (error) {
            deferred.reject(error);
            return;
          }
          deferred.resolve(nextValue);
        };

        on.rejected = function (reason) {
          if (predecessor && unIts.utils.isFunction(predecessor.onreject)) {
            predecessor.onreject(reason);
          }

          try {
            if (!unIts.utils.isFunction(onreject)) {
              onreject = function () {};
            }
            var nextReason = onreject(reason);
            onreject = null;
          } catch (error) {
            deferred.reject(error);
            return;
          }
          deferred.reject(nextReason);
        };

        if (resolution || rejection) {
          emit();
        }

        return deferred.promise;
      }
    };
    return deferAPI;
  };
  return API;
});