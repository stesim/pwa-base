import Variable from './variable.js';

class TransformedVariable extends Variable {
  constructor(originalVariable, map) {
    super();
    this._originalVariable = originalVariable;
    this._map = map;
    this._originalVariableListener = listener.bind(this);
    this._updateValue();
  }

  get value() {
    return super.value;
  }

  set value(value) {
    throw new Error('cannot assign to mapped variables');
  }

  onChange(listener) {
    if (this._listeners.length === 0) {
      this._originalVariable.onChange(this._originalVariableListener);
    }
    super.onChange(listener);
  }

  removeChangeListener(listener) {
    super.removeChangeListener(listener);
    if (this._listeners.length === 0) {
      this._originalVariable.removeChangeListener(this._originalVariableListener);
    }
  }

  _updateValue() {
    this._value = this._map(this._originalVariable.value);
  }
}

function listener() {
  this._updateValue();
  for (const listener of this._listeners) {
    listener(this._value);
  }
}

export default function mapVariable(variable, transform) {
  return new TransformedVariable(variable, transform);
}
