## Synopsis

ConceptJS is a KISS modular framework for javascript projects. It makes it possible to
structure code in 'concepts' with well defined interfaces. It also presents the
notion of dependency management between theese concepts.

## Code Example

First define a concept:

```javascript
    // concept.define(name?, dependencies?, codeFn?)
    concept.define('calc', [], function () {
      var API = {};

      API.add = function (a, b) {
        return a + b;
      };

      return API;
    });
```

Then use it:

```javascript
    var calculator = concept('calc');
    var result = calculator.add(2, 4); // result === 6 ...
```

## Motivation

What's so special with this? Well nothing really, and that I guess is what's so
special about it. I wanted to write modular javascript code with as little magic
as possible. A definite goal was that it should be extremely TDD-friendly, write
a unit test then write the unit.

## Installation

- git clone *url*
- npm install
- grunt

...or just copy the content of src/con.concept.js to somewhere nice.

## API Reference

### `concept ()`

Returns the framework version

### `concept (conceptName)`

If defined, returns an api-instance, if any, of the concept with the name *conceptName* (uh, yes,
if it is a string that is...), If no concept with *conceptName* is defined it will `throw`, also,
if any concept specified as a dependency (see below) to the concept is not defined it will
`throw`.

Any arguments after *conceptName* gets passed to the *conceptFunction* (see below) of the concept.

### `concept (conceptDefinition)`

Extracts an api-instance, if any, from the concept defined by the *conceptDefinition*. The
*conceptDefinition* is an object as returned by the `concept.define()` function. If
it does not recognize *conceptDefinition* as a, well, concept definition object, it
will `throw`.

### `concept.define(conceptName?, dependencies?, conceptFunction?)`

Ok, so *conceptName* is a `string`, *dependencies* is an `Array` of strings and
*conceptFunction* is a `Function`. The arguments are all optional, however the
order in which they are specified is not.

The function returns a *conceptDefinition* `object`.

#### *conceptName*

If provided, this is the identifier of the concept and is used with the `concept(conceptName)`
function to get an api-instance of the concept.

#### *dependencies*

An array of *conceptName*s that the concept depends on. Dependencies are checked at evaluation
time (when the concept is asked for) and not on definition time.

#### *conceptFunction*

The *conceptFunction* is the core of the concept. It returns an api-instance of the concept
(if it has one).

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
