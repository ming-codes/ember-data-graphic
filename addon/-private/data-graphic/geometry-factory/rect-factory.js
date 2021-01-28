import { functor, compute } from '../fn';
import { GeometryFactory } from './geometry-factory';
import { Rect } from '../geometry/rect';

export class RectFactory extends GeometryFactory {
  constructor({ x, y, cx, cy, x1, x2, y1, y2, width, height, ...options }) {
    super(options);

    if (width != null) {
      this.width = functor(width);
    } else if (x1 != null && x2 != null) {
      this.width = function width(datum) {
        return Math.abs(compute(x1, datum) - compute(x2, datum));
      };
    } else {
      throw new Error('Unable to derive width from parameters');
    }

    if (x != null) {
      this.x = functor(x);
    } else if (cx != null && width != null) {
      this.x = function x(datum) {
        return Math.abs(compute(cx, datum) - compute(width, datum) / 2);
      };
    } else if (x1 != null && x2 != null) {
      this.x = function x(datum) {
        return Math.min(compute(x1, datum), compute(x2, datum));
      };
    } else {
      throw new Error('Unable to derive x from parameters');
    }

    if (height != null) {
      this.height = functor(height);
    } else if (y1 != null && y2 != null) {
      this.height = function height(datum) {
        return Math.abs(compute(y1, datum) - compute(y2, datum));
      };
    } else {
      throw new Error('Unable to derive height from parameters');
    }

    if (y != null) {
      this.y = compute(y);
    } else if (cy != null && height != null) {
      this.y = function y(datum) {
        return Math.abs(compute(cy, datum) - compute(height, datum) / 2);
      };
    } else if (y1 != null && y2 != null) {
      this.y = function y(datum) {
        return Math.min(compute(y1, datum), compute(y2, datum));
      };
    } else {
      throw new Error('Unable to derive y from parameters');
    }
  }

  create(datum) {
    return new Rect({
      x: this.x(datum),
      y: this.y(datum),
      width: this.width(datum),
      height: this.height(datum),

      ...super.create(datum)
    });
  }
}
