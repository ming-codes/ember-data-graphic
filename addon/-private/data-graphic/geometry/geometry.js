export class Geometry {
  constructor({ fill, stroke, strokeWidth, opacity, transform }) {
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.opacity = opacity;
    this.transform = transform;
  }

  toPathString() {
    return '';
  }

  toPath(pixelRatio){
    return new Path2D(this.toPathString(pixelRatio));
  }
}
