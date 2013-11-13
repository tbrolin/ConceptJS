unIts.define('units.promise', [], function () {
  var API = {};

  API.defer = function () {
    var deferAPI = {}, on = {}, resolution, rejection;
    deferAPI.resolve = function (value) {
      if (resolution || rejection) {
        throw 'Promise already resolved or rejected.';
      }
      resolution = value;
      if (on.resolved) {
        on.resolved(value);
        on.resolved = undefined;
      }
    };

    deferAPI.reject = function (reason) {
      if (resolution || rejection) {
        throw 'Promise already resolved or rejected';
      }
      rejection = reason;
      if (on.rejected) {
        on.rejected(reason);
        on.rejected = undefined;
      }
    };

    deferAPI.promise = {
      then: function (onresolve, onreject) {
        var deferred = API.defer ();

        on.resolved = function (value) {
          setTimeout(function () {
            if (unIts.utils.isFunction (onresolve)) {
              deferred.resolve (onresolve(value));
            } else {
              deferred.resolve();
            }
          });
        };

        on.rejected = function (reason) {
          setTimeout(function () {
            if (unIts.utils.isFunction (onreject)) {
              deferred.reject (onreject(reason));
            } else {
              deferred.reject();
            }
          }, 4);
        };

        if (resolution) {
          on.resolved (resolution);
        } else if (rejection) {
          on.rejected (rejection);
        }

        return deferred.promise;
      }
    };
    return deferAPI;
  };
  return API;
});