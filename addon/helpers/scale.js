import { helper } from '@ember/component/helper';
import { camelize } from '@ember/string';

import * as d3 from 'd3-scale';

const CACHE = {};

function resolve(type) {
  if (CACHE[type]) {
    return CACHE[type];
  }

  return (CACHE[type] = d3[camelize(`scale-${type}`)]);
}

function assign(scale, properties) {
  for (let key in properties) {
    scale[key](properties[key]);
  }

  return scale;
}

export default helper(function scale([ type, ...argv ], hash) {
  return assign(resolve(type)(...argv.map(arg => {
    if (Array.isArray(arg)) {
      return arg;
    }

    if (typeof arg === 'number') {
      return [ 0, arg ];
    }

    if (typeof arg === 'string') {
      return arg.split(/\s+/).map(Number);
    }
  })), hash);
});
