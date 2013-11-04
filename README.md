## Synopsis

unIts is a KISS modular framework for javascript projects. It makes it possible to
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

What's so special with this? Well nothing really, and that I guess is what's so
special about it. I wanted to write modular javascript code with as little magic
as possible. A definite goal was that it should be extremely TDD-friendly, write
a unit test then write the unit (hence the name duh).

## Installation

- git clone *url*
- npm install
- grunt

...or just copy the content of src/un.units.js to somewhere nice.

## API Reference

### `unIts()`

Returns the unIts version

### `unIts(unitName)`

If defined, returns an api-instance, if any, of the unit with the name *unitName* (uh, yes,
if it is a string that is...), If no unit with *unitName* is defined it will `throw`, also,
if any unit specified as a dependency (see below) to the unit is not defined it will
`throw`.

Any arguments after *unitName* gets passed to the *unitFunction* (see below) of the unit.

### `unIts(unitDefinition)`

Extracts an api-instance, if any, from the unit defined by the *unitDefinition*. The
*unitDefinition* is an object as returned by the `unIts.define()` function. If
it does not recognize *unitDefinition* as a, well, unit-definition object, it
will `throw`.

### `unIts.define(unitName?, dependencies?, unitFunction?)`

Ok, so *unitName* is a `string`, *dependencies* is an `Array` of strings and
*unitFunction* is a `Function`. The arguments are all optional, however the
order they are specified is not.

The function returns a *unitDefinition* `object`.

#### *unitName*

If provided, this is the identifier of the unit and is used with the `unIts(unitName)`
function to get an api-instance of the unit.

#### *dependencies*

An array of *unitName*s that the unit depends on. Dependencies are checked at evaluation
time (when the unit is asked for) and not on definition time.

#### *unitFunction*

The *unitFunction* is the core of the unit. It returns an api-instance of the unit
(if such exists).

## Examples

TODO: Come up with a nifty example!

## Contributors

Tobias Brolin tbrolin@kth.se

## License

I found this on the internet:

The MIT License (MIT)

Copyright (c) 2013 Tobias Brolin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
