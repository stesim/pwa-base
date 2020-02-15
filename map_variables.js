import Variable from './variable.js';

class TransformedVariable extends Variable {
  constructor(originalVariables, map) {
    super();
    this._originalVariables = originalVariables;
    this._map = map;
    this._originalVariablesListener = listener.bind(this);
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
      this._originalVariables.forEach(
        variable => variable.onChange(this._originalVariablesListener));
    }
    super.onChange(listener);
  }

  removeChangeListener(listener) {
    super.removeChangeListener(listener);
    if (this._listeners.length === 0) {
      this._originalVariables.forEach(
        variable => variable.removeChangeListener(this._originalVariablesListener));
    }
  }

  _updateValue() {
    this._value = this._map(
      ...this._originalVariables.map(variable => variable.value));
  }
}

function listener() {
  this._updateValue();
  for (const listener of this._listeners) {
    listener(this._value);
  }
}

export default function mapVariables(variables, transform) {
  return new TransformedVariable(variables, transform);
}
