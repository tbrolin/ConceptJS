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

returns the unIts version

### `unIts(unitName)`

if defined, returns the api, if any, of the unit with the name *unitName* (Uh, yes,
if it is a string that is...)

### `unIts(unitDefinition)`

extracts the api, if any, from the unit defined by the *unitDefinition*. The 
*unitDefinition* is an object as returned by the `unIts.define()` function.

### `unIts.define(unitName?, dependencies?, unitFunction?)`

Explanation coming soon.

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
