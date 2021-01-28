import { functor } from '../fn';
import { Geometry } from '../geometry/geometry';

export class GeometryFactory {
  constructor({ fill, stroke, strokeWidth, opacity, transform }) {
    this.fill = functor(fill);
    this.stroke = functor(stroke);
    this.strokeWidth = functor(strokeWidth);
    this.opacity = functor(opacity);
    this.transform = functor(transform);
  }

  create(datum) {
    return new Geometry({
      fill: this.fill(datum),
      stroke: this.stroke(datum),
      strokeWidth: this.strokeWidth(datum),
      opacity: this.opacity(datum),
      transform: this.transform(datum),
    });
  }
}
