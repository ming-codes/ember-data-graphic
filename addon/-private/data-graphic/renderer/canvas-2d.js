import { Renderer } from './renderer';
import { Motion } from '../motion';

import { parseTransformString, parseRelativeSize } from '../parse';

export class RendererForCanvas2D extends Renderer {
  constructor(context, scheduler) {
    super(context, scheduler);

    const { canvas } = context;

    scheduler.on('start', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    const { fontSize, fontFamily, fontWeight, color } = getComputedStyle(canvas);

    context.save();

    this.font = {
      color,
      fontWeight,
      fontSize: parseFloat(fontSize),
      fontFamily: fontFamily
        .split(/,\s*/)
        .map(str => str.replace(/"/g, ''))
        .find(font => {
          const set = `10px ${font}`;

          context.font = set;

          return context.font === set;
        })
    };

    context.restore();
  }

  datumFromPoint({ offsetX: x, offsetY: y }, { motions, lookup }) {
    const { context } = this;

    for (let [ mapKey, { object } ] of motions.entries()) {
      if (context.isPointInPath(object.toPath(), x, y)) {
        return lookup.get(mapKey);
      }
    }

    return null;
  }

  advance(args) {
    const { motions } = args;

    console.time('advance');
    super.advance(args, {
      enter(from, to, key, duration, easing) {
        this.measure();

        this.apply(to);

        motions.set(key, new Motion({
          from,
          to,
          duration,
          easing,

          append: true
        }));
      },

      update(from, to, key, duration, easing) {
        motions.set(key, new Motion({
          from,
          to,
          duration,
          easing,
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

          remove: true
        }));
      }
    });
    console.timeEnd('advance');
  }

  render(time, args) {
    const { motions, lookup } = args;

    for (let [ mapKey, motion ] of motions) {
      const model = motion.interpolate(time);

      // if we're removing and the playhead reached end, we just skip the paint
      if (motion.remove && motion.playhead === 1) {
        motions.delete(mapKey);
        lookup.delete(mapKey);
      } else {
        this.apply(model);
      }
    }
  }

  apply(model) {
    const { context } = this;
    const { transform, opacity, fill: fillRaw, stroke: strokeRaw, tagName } = model;

    const fill = fillRaw === 'currentColor' ? this.font.color : fillRaw;
    const stroke = strokeRaw === 'currentColor' ? this.font.color : strokeRaw;

    context.save();

    if (!isNaN(opacity)) {
      context.globalAlpha = Number(opacity);
    }

    if (transform) {
      const [ a, b, c, d, e, f ] = parseTransformString(transform);

      context.setTransform(a, b, c, d, e, f);
    }

    if (tagName === 'text') {
      const { font } = this;
      const { x, dx = 0, y, dy = 0 } = model;
      const { textAlign = 'center', textContent } = model;
      const { fontSize = font.fontSize, fontFamily = font.fontFamily, fontWeight = font.fontWeight } = model;
      const [ ax, adx, ay, ady ] = parseRelativeSize(font.fontSize, x, dx, y, dy);
      const tx = (ax + adx);
      const ty = (ay + ady);

      context.font = (`${fontWeight} ${fontSize}px ${fontFamily}`).trim();
      context.textAlign = textAlign;

      if (fill) {
        context.fillStyle = fill;
        context.fillText(textContent, tx, ty);
      }

      if (stroke) {
        const { strokeWidth = 1 } = model;

        context.lineWidth = strokeWidth;
        context.strokeStyle = stroke;
        context.strokeText(textContent, tx, ty);
      }
    }

    if (tagName === 'rect') {
      const { x, y, width, height } = model;

      if (fill) {
        context.fillStyle = fill;
        context.fillRect(x, y, width, height);
      }

      if (stroke) {
        const { strokeWidth = 1 } = model;

        context.lineWidth = strokeWidth;
        context.strokeStyle = stroke;
        context.strokeRect(x, y, width, height);
      }
    }

    if (tagName === 'path') {
      const path = new Path2D(model.d);

      if (fill) {
        context.fillStyle = fill;
        context.fill(path);
      }

      if (stroke) {
        const { strokeWidth = 1 } = model;

        context.lineWidth = strokeWidth;
        context.strokeStyle = stroke;
        context.stroke(path);
      }
    }

    context.restore();
  }
}

