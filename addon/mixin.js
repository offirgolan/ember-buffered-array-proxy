import Mixin from '@ember/object/mixin';
import { computed, get, setProperties } from '@ember/object';
import { alias, readOnly } from '@ember/object/computed';
import { isArray } from '@ember/array';

export default Mixin.create({
  _content: null,
  _isBuffered: false,

  buffer: alias('content'),
  hasChanges: readOnly('hasBufferedChanges'),

  hasBufferedChanges: computed('_content.[]', 'buffer.[]', '_isBuffered', function() {
    return this.hasChanged();
  }).readOnly(),

  changes: computed('_content.[]', 'buffer.[]', '_isBuffered', function() {
    const content = this.get('_content');
    const buffer = this.get('buffer');
    const changes = { added: [], removed: [] };

    if (this.get('_isBuffered')) {
      changes.added = buffer.filter((item) => !content.includes(item));
      changes.removed = content.filter((item) => !buffer.includes(item));
    }

    return changes;
  }).readOnly(),

  initializeBuffer() {
    const content = get(this, 'content');

    setProperties(this, {
      _content: content,
      _isBuffered: true,
      buffer: isArray(content) ? content.toArray() : []
    });
  },

  replaceContent() {
    if (!get(this, '_isBuffered')) {
      this.initializeBuffer();
    }

    return this._super(...arguments);
  },

  applyChanges() {
    return this.applyBufferedChanges(...arguments);
  },

  applyBufferedChanges() {
    const buffer = get(this, 'buffer');
    const content = get(this, '_content');

    if (get(this, '_isBuffered')) {
      content.setObjects(buffer);
      this.discardBufferedChanges();
    }
  },

  discardChanges() {
    return this.discardBufferedChanges(...arguments);
  },

  discardBufferedChanges() {
    if (get(this, '_isBuffered')) {
      setProperties(this, {
        _content: null,
        _isBuffered: false,
        buffer: this.get('_content')
      });
    }
  },

  hasChanged() {
    const content = get(this, '_content');
    const buffer = get(this, 'buffer');

    if (!get(this, '_isBuffered')) {
      return false;
    }

    const bufferLength = get(buffer, 'length');
    const contentLength = get(content, 'length');

    if (bufferLength !== contentLength) {
      return true;
    }

    for (let i = 0; i < bufferLength; i++) {
      if (buffer.objectAt(i) !== content.objectAt(i)) {
        return true;
      }
    }

    return false;
  }
});
