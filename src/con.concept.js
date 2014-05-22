var concept = (function () {
  'use strict';

  var units = {};
  var utils = {};

  ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function (name) {
    utils['is' + name] = function (obj) {
      return utils.toString.call(obj) === '[object ' + name + ']';
    };
  });

  utils.isObject = function (obj) {
    return obj === Object(obj);
  };

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
   * Get a concept's interface. First argument is either the identifier for
   * the concept as a string or a concept object itself. Succeeding arguments gets
   * passed to the concept´s body-function.
   *
   * Calling concept without arguments returns the framework version.
   *
   * concept('conceptName', [arg0, arg1, ..., argN])
   * concept(conceptObj, [arg0, arg1, ..., argN])
   */
  var API = function concept () {
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
        'type': 'CONCEPT-NOT-FOUND',
        'origin': 'con.concept.js',
        'message': 'Concept \"' + unitDescriptor + '\" is not defined.'
      });
    }

    unit.deps.forEach (function (dependency) {
      if (!units[dependency]) {
        throw error({
          'type': 'DEPENDENCY-NOT-FOUND',
          'origin': 'con.concept.js',
          'message': 'Concept ' + dependency + ' is not defined.'
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
          'origin': 'con.concept.js',
          'message': 'Could not define concept from arguments.'
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
          'origin': 'con.concept.js',
          'message': 'Could not define concept from arguments.'
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
          'origin': 'con.concept.js',
          'message': 'Could not define concept from arguments.'
        });
      }
    }

    units[unitName] = { 'scope': {}, 'deps': unitDeps, 'fn': unitFn };
    return units[unitName];
  };

  API.error = error;
  API.utils = utils;

  return API;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = concept;
}
