import Mixin from 'ember-buffered-array-proxy/mixin';
import ArrayProxy from '@ember/array/proxy'
import { A as EmberArray } from '@ember/array'
import EmberObject, { get } from '@ember/object';
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

test('it works with a non ember array', (assert) => {
  const BufferedArrayProxy = ArrayProxy.extend(Mixin);
  const content = ['a'];
  const proxy = BufferedArrayProxy.create({ content });

  assert.equal(proxy.objectAt(0), 'a');
  assert.equal(content[0], 'a');

  assert.equal(get(proxy, 'hasBufferedChanges'), false);

  proxy.addObject('b');

  assert.equal(proxy.objectAt(1), 'b');
  assert.notOk(content.objectAt(1));
  assert.equal(get(proxy, 'hasBufferedChanges'), true);

  proxy.applyBufferedChanges();

  assert.equal(proxy.objectAt(1), 'b');
  assert.equal(content[1], 'b');
  assert.deepEqual(content, proxy.toArray());
  assert.equal(get(proxy, 'hasBufferedChanges'), false);
});

test('aliased methods work', (assert) => {
  const BufferedArrayProxy = ArrayProxy.extend(Mixin);
  const proxy = BufferedArrayProxy.create({ content: [1] });

  proxy.addObject(2)
  assert.ok(get(proxy, 'hasChanges'), 'Modified proxy has changes');

  proxy.applyChanges();
  assert.deepEqual(proxy.toArray(), [1, 2], 'Applying changes sets the content\'s property');
  assert.notOk(get(proxy, 'hasChanges'), 'Proxy has no changes after changes are applied');

  proxy.removeObject(1);
  proxy.discardChanges();
  assert.ok(proxy.includes(1), 'Discarding changes resets the proxy\'s property');
  assert.notOk(get(proxy, 'hasChanges'), 'Proxy has no changes after changes are discarded');
});

test('changes object', (assert) => {
  const BufferedArrayProxy = ArrayProxy.extend(Mixin);
  const proxy = BufferedArrayProxy.create({ content: [1] });

  assert.deepEqual(get(proxy, 'changes'), { added: [], removed: [] });

  proxy.addObject(2);
  proxy.removeObject(1);

  assert.deepEqual(get(proxy, 'changes'), { added: [2], removed: [1] });

  proxy.discardBufferedChanges();
  assert.deepEqual(get(proxy, 'changes'), { added: [], removed: [] });

  proxy.setObjects([2, 3]);
  assert.deepEqual(get(proxy, 'changes'), { added: [2, 3], removed: [1] });

  proxy.applyBufferedChanges();
  assert.deepEqual(get(proxy, 'changes'), { added: [], removed: [] });
});

test('allows passing other variables at .create time', (assert) => {
  const BufferedArrayProxy = ArrayProxy.extend(Mixin);
  const fakeContainer = EmberObject.create({});

  const proxy = BufferedArrayProxy.create({
    content: [1],
    container: fakeContainer,
    foo: 'foo',
  });

  assert.equal(proxy.get('container'), fakeContainer, 'Proxy didn\'t allow defining container property at create time');
  assert.equal(proxy.get('foo'), 'foo', 'Proxy didn\'t allow setting an arbitrary value at create time');
});
