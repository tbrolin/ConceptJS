var unIts = (function () {
  'use strict';

  var units = {};
  var utils = {};

  ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function (name) {
    utils['is' + name] = function (obj) {
      return utils.toString.call(obj) === '[object ' + name + ']';
    };
  });

  var error = function error (err, messages) {
    if (!messages || !messages[err.type]) {
      messages = {};
      messages[err.type] = err.message || 'There was an unknown error.';
    }
    err.message = 'ERROR: ' + messages[err.type];
    err.time = new Date();
    err.type = err.type || 'UNIT-ERROR';
    err.origin = err.origin || 'UNKNOWN';
    err.rootCause = err.rootCause || 'UNKNOWN';
    // console.log(error.message, error);
    return err;
  };

  /**
   * Get a unit's interface. First argument is either the identifier for
   * the unit as a string or a unit object itself. Succeeding arguments gets
   * passed to the unit´s body-function.
   *
   * Calling unIts without arguments returns the unIts version.
   *
   * unIts('unitName', [arg0, arg1, ..., argN])
   * unIts(unit, [arg0, arg1, ..., argN])
   */
  var API = function unIts () {
    var args = Array.prototype.slice.call(arguments),
        unitDescriptor,
        unit,
        scope;

    if (args.length === 0) {
      return '0.1.0';
    }

    unitDescriptor = args.shift();

    if (unitDescriptor.scope && unitDescriptor.deps && unitDescriptor.fn) {
      unit = unitDescriptor;
    } else {
      unit = units[unitDescriptor];
    }

    if (!unit) {
      throw error ({
        'type': 'UNIT-NOT-FOUND',
        'origin': 'un.unit.js',
        'message': 'Unit \"' + unitDescriptor + '\" is not defined.'
      });
    }

    unit.deps.forEach (function (dependency) {
      if (!units[dependency]) {
        throw error({
          'type': 'DEPENDENCY-NOT-FOUND',
          'origin': 'un.unit.js',
          'message': 'Unit ' + dependency + ' is not defined.'
        });
      }
    });

    // TODO: Should 'this' point to shared unit scope or like here have a
    // reference (this.unit) to it?
    scope = {};
    scope.unit = unit.scope;
    return unit.fn.apply(scope, args);
  };

  /**
   * Defines a new unit.
   *
   * FIXME: Anonymous units does impose a memory-leak
   * TODO: Should default unitFn return an empty object?
   *
   * @returns
   */
  API.define = function define () {
    var unitName = 'anonymous' + new Date().getTime(),
        unitDeps = [],
        unitFn = function () { return {}; },
        args = Array.prototype.slice.call(arguments);

    if (args.length === 1) {
      if (utils.isFunction(args[0])) {
        unitFn = args[0];
      } else if (utils.isString(args[0])) {
        unitName = args[0];
      } else if (args[0].forEach) {
        unitDeps = args[0];
      } else {
        throw error({
          'type': 'WRONG-ARGUMENTS',
          'origin': 'un.units.js',
          'message': 'Could not define unit from arguments.'
        });
      }
    } else if (args.length === 2) {
      if (utils.isString(args[0]) && args[1].forEach) {
        unitName = args[0];
        unitDeps = args[1];
      } else if (utils.isString(args[0]) && utils.isFunction(args[1])) {
        unitName = args[0];
        unitFn = args[1];
      } else if (args[0].forEach && utils.isFunction(args[1])) {
        unitDeps = args[0];
        unitFn = args[1];
      } else {
        throw error({
          'type': 'WRONG-ARGUMENTS',
          'origin': 'un.units.js',
          'message': 'Could not define unit from arguments.'
        });
      }
    } else if (args.length > 2) {
      if (utils.isString(args[0]) && args[1].forEach && utils.isFunction(args[2])) {
        unitName = args[0];
        unitDeps = args[1];
        unitFn = args[2];
      } else {
        throw error({
          'type': 'WRONG-ARGUMENTS',
          'origin': 'un.units.js',
          'message': 'Could not define unit from arguments.'
        });
      }
    }

    units[unitName] = { 'scope': {}, 'deps': unitDeps, 'fn': unitFn };
    return units[unitName];
  };

  /**
   * Creates an error.
   *
   */
  API.error = error;
  API.utils = utils;

  return API;
})();

if (module && module.exports) {
  module.exports = unIts;
}