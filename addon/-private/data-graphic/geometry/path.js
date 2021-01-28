import { Geometry } from './geometry';

export class Path extends Geometry {
  tagName = 'path';

  constructor({ d, ...options }) {
    super(options);

    this.d = d;
  }

  toPathString() {
    return this.d;
  }

}
