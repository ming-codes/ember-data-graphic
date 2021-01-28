import { GeometryFactory } from './geometry-factory';
import { Rect } from '../geometry/rect';

export class PolylineFactory extends GeometryFactory {
  constructor({ points, x, y, ...options }) {
    super(options);
  }
}
