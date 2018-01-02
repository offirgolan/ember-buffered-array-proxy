import BufferedArrayProxy from 'ember-buffered-array-proxy/proxy';
import BufferedArrayMixin from 'ember-buffered-array-proxy/mixin';
import { module, test } from 'qunit';

module('ember-buffered-array-proxy/proxy');

test('it exists', (assert) => {
  assert.ok(BufferedArrayProxy);
});

test('it has the right mixin', (assert) => {
  assert.ok(BufferedArrayMixin.detect(BufferedArrayProxy.create()));
});
