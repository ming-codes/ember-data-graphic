import { Geometry } from './geometry';

export class Rect extends Geometry {
  tagName = 'rect';

  constructor({ x, y, width, height, ...options }) {
    super(options);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  toPathString(pixelRatio = 1) {
    const { x, y, width, height } = this;

    return `M${x * pixelRatio},${y * pixelRatio}h${width * pixelRatio}v${height * pixelRatio}h${-width * pixelRatio}z`;
  }

  *triangles() {
    const [ x, y, width, height ] = [ this.x, this.y, this.width, this.height ].map(Number);

    yield x;
    yield y;
    yield x;
    yield y + height;
    yield x + width;
    yield y;
    yield x;
    yield y + height;
    yield x + width;
    yield y;
    yield x + width;
    yield y + height;
  }
}
