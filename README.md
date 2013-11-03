## Synopsis

unIts is a modular framework for javascript projects. It makes it possible to
structure code in units that have well defined interfaces. It also presents the
notion of dependency management between theese unIts.

## Code Example

First define a unit:

    unIts.define('calc', [], function () {
      var API = {};

      API.add = function (a, b) {
        return a + b;
      };
    });

Then use it:

    var calculator = unIts('calc');
    var result = calc.add(2, 4); // result === 6 ...

## Motivation

TODO

## Installation

Provide code examples and explanations of how to get the project.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)