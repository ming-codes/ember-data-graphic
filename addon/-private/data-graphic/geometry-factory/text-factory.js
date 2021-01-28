import { functor, compute, identity } from '../fn';
import { GeometryFactory } from './geometry-factory';
import { Text } from '../geometry/text';

export class TextFactory extends GeometryFactory {
  constructor({ x, y, dx, dy, textContent, textAnchor, fontSize, fontFamily, fontWeight, ...options }) {
    super(options);

    this.x = functor(x);
    this.y = functor(y);
    this.dx = functor(dx);
    this.dy = functor(dy);

    this.textAnchor = functor(textAnchor);
    this.textContent = functor(textContent ?? identity);

    this.fontSize = functor(fontSize ?? 10 * devicePixelRatio);
    this.fontFamily = functor(fontFamily ?? 'sans-serif');
    this.fontWeight = functor(fontWeight);
  }

  create(datum) {
    return new Text({
      x: this.x(datum),
      y: this.y(datum),
      dx: this.dx(datum),
      dy: this.dy(datum),

      textAnchor: this.textAnchor(datum),
      textContent: this.textContent(datum),

      fontSize: this.fontSize(datum),
      fontFamily: this.fontFamily(datum),
      fontWeight: this.fontWeight(datum),

      ...super.create(datum)
    });
  }
}
