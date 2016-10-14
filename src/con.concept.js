var concept = (function () {
  'use strict';

  var concepts = {};
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
    err.type = err.type || 'CONCEPT-ERROR';
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
        conceptDescriptor,
        concept,
        scope;

    if (args.length === 0) {
      return '0.1.0';
    }

    conceptDescriptor = args.shift();

    if (conceptDescriptor.scope && conceptDescriptor.deps && conceptDescriptor.fn) {
      concept = conceptDescriptor;
    } else {
      concept = concepts[conceptDescriptor];
    }

    if (!concept) {
      throw error ({
        'type': 'CONCEPT-NOT-FOUND',
        'origin': 'con.concept.js',
        'message': 'Concept \"' + conceptDescriptor + '\" is not defined.'
      });
    }

    concept.deps.forEach (function (dependency) {
      if (!concepts[dependency]) {
        throw error({
          'type': 'DEPENDENCY-NOT-FOUND',
          'origin': 'con.concept.js',
          'message': 'Concept ' + dependency + ' is not defined.'
        });
      }
    });

    // TODO: Should 'this' point to shared concept scope or like here have a reference (this.concept) to it?
    scope = {};
    scope.concept = concept.scope;
    return concept.fn.apply(scope, args);
  };

  /**
   * Defines a new concept.
   *
   * FIXME: Anonymous concepts does impose a memory-leak
   * TODO: Should default conceptFn return an empty object?
   *
   * @returns
   */
  API.define = function define () {
    var conceptName = 'anonymous' + new Date().getTime(),
        conceptDeps = [],
        conceptFn = function () { return {}; },
        args = Array.prototype.slice.call(arguments);

    if (args.length === 1) {
      if (utils.isFunction(args[0])) {
        conceptFn = args[0];
      } else if (utils.isString(args[0])) {
        conceptName = args[0];
      } else if (args[0].forEach) {
        conceptDeps = args[0];
      } else {
        throw error({
          'type': 'WRONG-ARGUMENTS',
          'origin': 'con.concept.js',
          'message': 'Could not define concept from arguments.'
        });
      }
    } else if (args.length === 2) {
      if (utils.isString(args[0]) && args[1].forEach) {
        conceptName = args[0];
        conceptDeps = args[1];
      } else if (utils.isString(args[0]) && utils.isFunction(args[1])) {
        conceptName = args[0];
        conceptFn = args[1];
      } else if (args[0].forEach && utils.isFunction(args[1])) {
        conceptDeps = args[0];
        conceptFn = args[1];
      } else {
        throw error({
          'type': 'WRONG-ARGUMENTS',
          'origin': 'con.concept.js',
          'message': 'Could not define concept from arguments.'
        });
      }
    } else if (args.length > 2) {
      if (utils.isString(args[0]) && args[1].forEach && utils.isFunction(args[2])) {
        conceptName = args[0];
        conceptDeps = args[1];
        conceptFn = args[2];
      } else {
        throw error({
          'type': 'WRONG-ARGUMENTS',
          'origin': 'con.concept.js',
          'message': 'Could not define concept from arguments.'
        });
      }
    }

    concepts[conceptName] = { 'scope': {}, 'deps': conceptDeps, 'fn': conceptFn };
    return concepts[conceptName];
  };

  /**
   * Creates an error.
   *
   */
  API.error = error;
  API.utils = utils;

  return API;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = concept;
}
