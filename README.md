## Synopsis

unIts is a modular KISS framework for javascript projects. It makes it possible to
structure code in units with well defined interfaces. It also presents the
notion of dependency management between theese unIts.

## Code Example

First define a unit:

    // unIts.define(name?, dependencies?, codeFn?)
    unIts.define('calc', [], function () {
      var API = {};

      API.add = function (a, b) {
        return a + b;
      };

      return API;
    });

Then use it:

    var calculator = unIts('calc');
    var result = calculator.add(2, 4); // result === 6 ...

## Motivation

## Installation

## API Reference

## Tests

## Contributors

Tobias Brolin tbrolin@kth.se

## License
