# ember-buffered-array-proxy [![Build Status](https://travis-ci.org/offirgolan/ember-buffered-array-proxy.svg?branch=master)](https://travis-ci.org/offirgolan/ember-buffered-array-proxy) [![npm version](https://badge.fury.io/js/ember-buffered-array-proxy.svg)](http://badge.fury.io/js/ember-buffered-array-proxy)

An Ember Array Proxy (and mixin) the enables change buffering. Ever need to "hold back" array changes before they propagate? If so this may be the project for you.

This project follows similar API structure as [ember-buffered-proxy](https://github.com/yapplabs/ember-buffered-proxy).

## Usage

```sh
ember install ember-buffered-array-proxy
```

```js
import BufferedArrayProxy from 'ember-buffered-array-proxy/proxy';

const content = [ 'A' ];
const buffer = BufferedArrayProxy.create({ content });

buffer.get('firstObject'); // => 'A'
buffer.addObject('B');

buffer.objectAt(1); // => 'B'
buffer.toArray(); // => ['A', 'B']

buffer.get('hasChanges'); // => true
buffer.get('changes'); // => (get an object describing the changes) -- { added: ['B'], removed: [] }

buffer.applyBufferedChanges();

buffer.toArray(); // => ['A', 'B']
content.toArray(); // => ['A', 'B']
buffer.get('hasChanges'); // => false

buffer.removeObject('A');
buffer.get('changes'); // => { added: [], removed: ['A'] }
buffer.hasChanged(); // => true

buffer.discardBufferedChanges();

buffer.toArray(); // => ['A', 'B']
content.toArray(); // => ['A', 'B']
buffer.hasChanged(); // => false
```

You can also use these shorter method names

```js
buffer.discardChanges(); // equivalent to buffer.discardBufferedChanges()
buffer.applyChanges();   // equivalent to buffer.applyBufferedChanges()
```

Or you can grab the mixin directly

```js
import BufferedArrayMixin from 'ember-buffered-array-proxy/mixin';

const content = ['A']
const buffer = ArrayProxy.extend(BufferedArrayMixin).create({ content });

// same as above
```
