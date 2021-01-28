import { Geometry } from './geometry';

export class Circle extends Geometry {
  tagName = 'circle';

  constructor({ r, cx, cy, ...options }) {
    super(options);

    this.r = r;
    this.cx = cx;
    this.cy = cy;
  }
}
