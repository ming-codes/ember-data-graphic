import { Geometry } from './geometry';

export class Line extends Geometry {
  tagName = 'line';

  constructor({ x1, x2, y1, y2, ...options }) {
    super(options);

    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }
}
