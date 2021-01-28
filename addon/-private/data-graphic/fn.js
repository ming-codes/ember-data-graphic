export function functor(value) {
  if (typeof value === 'function') {
    return value;
  }

  return function() {
    return value;
  };
}

export function compute(value, datum) {
  if (typeof value === 'function') {
    return value(datum);
  }

  return value;
}

export function identity(datum) {
  return datum;
}

export function noop() {}
