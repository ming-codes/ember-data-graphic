import { functor, compute } from '../fn';
import { GeometryFactory } from './geometry-factory';
import { Path } from '../geometry/path';

import { camelize } from '@ember/string';

export class PathFactory extends GeometryFactory {
  constructor({ d, ...options }) {
    super({ fill: 'none', ...options });

    this.d = d;
  }

  create(datum) {
    return new Path({
      d: this.d(datum),

      ...super.create(datum)
    });
  }
}
