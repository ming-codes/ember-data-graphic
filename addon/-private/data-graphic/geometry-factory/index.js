import { RectFactory } from './rect-factory';
import { TextFactory } from './text-factory';
import { LineFactory } from './line-factory';
import { PathFactory } from './path-factory';

const FACTORIES = {
  rect: RectFactory,
  path: PathFactory,
  line: LineFactory,
  text: TextFactory
};

export function createGeometryFactoryFor(type, options) {
  return new FACTORIES[type](options);
}
