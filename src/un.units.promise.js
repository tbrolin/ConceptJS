if (typeof require !== 'undefined') {
  var unIts = require('./un.units');
}

unIts.define('units.promise', [], function () {
  var API = {};

  API.defer = function () {
    var deferAPI = {}, on = {}, resolution, rejection;

    // Unleash the execution chain reaction
    function emit () {
      var emitValue = rejection || resolution;

      var emitter = resolution ? on.resolved : on.rejected;

      if (emitValue.then) {
        // case is promise
        emitValue.then(function (value) {
          on.resolved (value); }, function (reason) {
          on.rejected (reason); }
        );
      } else {
        setTimeout(function () {
          if (unIts.utils.isFunction(emitter)) {
            emitter (emitValue);
          }
          on.resolved = null;
          on.rejected = null;
        });
      }
    }

    deferAPI.resolve = function (value) {
      if (rejection || resolution) {
        // throw 'Promise already resolved or rejected.';
        return;
      }
      resolution = value;
      if (on.resolved) {
        emit();
      }
    };

    deferAPI.reject = function (reason) {
      if (rejection || resolution) {
        // throw 'Promise already resolved or rejected';
        return;
      }
      rejection = reason;
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
            var nextValue = onresolve(value);
          } catch (error) {
            deferred.reject(error);
            return;
          }
          deferred.resolve(nextValue);
        };

        on.rejected = function (reason) {
          if (predecessor && unIts.utIls.isFunction(predecessor.onreject)) {
            predecessor.onreject(reason);
          }
          deferred.reject(onreject(reason));
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