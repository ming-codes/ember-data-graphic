import { helper } from '@ember/component/helper';

const CACHE = new Map();

function createPlucker(path) {
  const segments = path.split('.');

  if (segments.length === 1) {
    return function(datum) {
      return datum[path];
    };
  }

  return function(datum) {
    return segments.reduce((prev, segment) => {
      return prev[segment];
    }, datum);
  };
}

function getPluckerFor(path) {
  if (CACHE[path]) {
    return CACHE[path];
  }

  return (CACHE[path] = createPlucker(path));
}

export default helper(function field(params) {
  switch (params.length) {
    case 1: return getPluckerFor(params[0]);
    case 2: return getPluckerFor(params[0])(params[1]);
  }

  throw new Error('field helper needs at least 1 positional parameter');
});
