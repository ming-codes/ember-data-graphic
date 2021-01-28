import { camelize } from '@ember/string';
import * as d3 from 'd3-ease';

export function resolve(easing) {
  if (typeof easing === 'undefined') {
    return d3.easeLinear;
  }

  if (typeof easing === 'string') {
    return d3[camelize(`ease-${easing}`)];
  }

  return easing;
}
