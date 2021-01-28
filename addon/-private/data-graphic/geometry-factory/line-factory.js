import { functor, compute } from '../fn';
import { GeometryFactory } from './geometry-factory';
import { Line } from '../geometry/line';

export class LineFactory extends GeometryFactory {
  constructor({ x1, x2, y1, y2, ...options }) {
    super(options);

    this.x1 = functor(x1);
    this.x2 = functor(x2);
    this.y1 = functor(y1);
    this.y2 = functor(y2);
  }

  create(datum) {
    return new Line({
      x1: this.x1(datum),
      x2: this.x2(datum),
      y1: this.y1(datum),
      y2: this.y2(datum),

      ...super.create(datum)
    });
  }
}

