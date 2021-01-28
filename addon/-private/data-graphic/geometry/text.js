import { Geometry } from './geometry';

export class Text extends Geometry {
  tagName = 'text';

  constructor({ x, y, dx, dy, textContent, textAnchor, fontSize, fontFamily, fontWeight, ...options }) {
    super(options);

    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.textAnchor = textAnchor;
    this.textContent = textContent;

    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
  }
}
