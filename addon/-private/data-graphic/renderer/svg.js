import { camelize } from '@ember/string';

import { Motion } from '../motion';

import { Renderer } from './renderer';

const SVG = 'http://www.w3.org/2000/svg';
const PROPERTIES_SYMBOL = '__properties';

export class RendererForSVG extends Renderer {
  static ATTRIBUTE_MAP = {
    rect: [ 'x', 'y', 'width', 'height' ],
    path: [ 'd' ],
    line: [ 'x1', 'x2', 'y1', 'y2' ],
    text: [ 'x', 'y', 'dx', 'dy', 'text-anchor', 'font-size', 'font-family', 'font-weight' ],

    '*': [ 'transform', 'fill', 'stroke', 'stroke-width', 'opacity' ]
  };
  static PROPERTY_MAP = {
    rect: [],
    path: [],
    line: [],
    text: [ 'text-content' ],

    '*': []
  };

  datumFromPoint({ screenX: x, screenY: y }, { elements, lookup }) {
    const refs = this.elementsFromPoint(x, y);

    for (let [ mapKey, element ] of elements.entries()) {
      if (refs.has(element)) {
        return lookup.get(mapKey);
      }
    }

    return null;
  }

  elementsFromPoint(x, y) {
    const refs = document.elementsFromPoint(x, y);
    const len = refs.length;
    const { context } = this;
    const collect = new Set();

    for (let index = 0; index < len; index++) {
      const element = refs[index];

      // The elements returned by elementsFromPoint
      // has a certain order. It start from the overlay
      // element, then elements from this context, then
      // not.
      if (context === element) {
        break;
      } else if (context.contains(element)) {
        collect.add(element);
      }
    }

    return collect;
  }

  advance(args) {
    const { parentElement } = args.morph.start;
    const { elements, motions } = args;

    return super.advance(args, {
      enter(from, to, key, duration, easing) {
        const element = document.createElementNS(SVG, to.tagName);

        element[PROPERTIES_SYMBOL] = {};

        elements.set(key, element);

        this.apply(to, element);

        parentElement.appendChild(element);

        motions.set(key, new Motion({
          from,
          to,
          duration,
          easing,

          element,
          append: true
        }));
      },

      update(from, to, key, duration, easing) {
        const element = elements.get(key);

        motions.set(key, new Motion({
          from,
          to,
          duration,
          easing,

          element
        }));
      },

      exit(from, to, key, duration, easing) {
        // FIXME This has problem is ordinal scale
        // the exit node is built around new scale, but the new scale has domain updated to exclude that key
        // first, think, how would I solve this problem in d3?
        motions.set(key, new Motion({
          from,
          to,
          duration,
          easing,

          element: elements.get(key),
          remove: true
        }));
      }
    });
  }

  render(time, args) {
    const { motions, lookup, elements } = args;

    for (let [ mapKey, motion ] of motions) {
      try {
        this.apply(motion.interpolate(time), motion.element);
      } finally {
        if (motion.remove && motion.playhead === 1) {
          motion.element.remove();

          lookup.delete(mapKey);
          elements.delete(mapKey);
          motions.delete(mapKey);
        }
      }
    }
  }

  apply(model, element) {
    const { ATTRIBUTE_MAP, PROPERTY_MAP } = this.constructor;
    const properties = element[PROPERTIES_SYMBOL];

    // TODO optimize the spread
    for (let attr of [ ...ATTRIBUTE_MAP[model.tagName], ...ATTRIBUTE_MAP['*'] ]) {
      const elementKey = attr;
      const modelKey = camelize(attr);

      if (modelKey in model && model[modelKey] != null) {
        const elementValue = String(model[modelKey]);

        if (properties[modelKey] !== elementValue) {
          element.setAttribute(elementKey, properties[modelKey] = elementValue);
        }
      } else {
        delete properties[elementKey];
        element.removeAttribute(elementKey);
      }
    }

    for (let prop of [ ...PROPERTY_MAP[model.tagName], ...PROPERTY_MAP['*'] ]) {
      const elementKey = camelize(prop);
      const modelKey = camelize(prop);

      if (modelKey in model && model[modelKey] != null) {
        element[elementKey] = model[modelKey];
      } else {
        delete element[elementKey];
      }
    }
  }
}
