import Mixin from 'ember-buffered-array-proxy/mixin';
import ArrayProxy from '@ember/array/proxy'
import { A as EmberArray } from '@ember/array'
import { get } from '@ember/object';
import { module, test } from 'qunit';

module('ember-buffered-array-proxy/mixin');

test('it works', (assert) => {
  const BufferedArrayProxy = ArrayProxy.extend(Mixin);
  const content = EmberArray(['a']);
  const proxy = BufferedArrayProxy.create({ content });

  assert.equal(proxy.objectAt(0), 'a');
  assert.equal(content.objectAt(0), 'a');

  assert.equal(get(proxy, 'hasBufferedChanges'), false);

  proxy.addObject('b');

  assert.equal(proxy.objectAt(1), 'b');
  assert.notOk(content.objectAt(1));
  assert.equal(get(proxy, 'hasBufferedChanges'), true);

  proxy.applyBufferedChanges();

  assert.equal(proxy.objectAt(1), 'b');
  assert.equal(content.objectAt(1), 'b');
  assert.deepEqual(content.toArray(), proxy.toArray());
  assert.equal(get(proxy, 'hasBufferedChanges'), false);

  proxy.addObject('c');

  assert.equal(proxy.objectAt(2), 'c');
  assert.notOk(content.objectAt(2));

  assert.equal(get(proxy, 'hasBufferedChanges'), true);

  proxy.discardBufferedChanges();

  assert.notOk(proxy.objectAt(2));
  assert.notOk(content.objectAt(2));
  assert.deepEqual(content.toArray(), proxy.toArray());
  assert.equal(get(proxy, 'hasBufferedChanges'), false);
});

