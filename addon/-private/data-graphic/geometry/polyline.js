import { Geometry } from './geometry';

export class Polyline extends Geometry {
  tagName = 'polyline';

  constructor({ points, ...options }) {
    super(options);

    this.points = points;
  }
}
