import { Renderer } from './renderer';
import { Motion } from '../motion';

import { now } from '../timer';

import createREGL from 'regl';

export class RendererForCanvasWebGL extends Renderer {
  constructor(gl, scheduler) {
    super(gl, scheduler);

    const regl = this.regl = createREGL({
      gl,
      extensions: ['angle_instanced_arrays']
    });

    // TODO These should all be per Mark

    const from = this.from = regl.buffer();
    const to = this.to = regl.buffer();

    this.program = regl({
      frag: `
      precision mediump float;
      uniform vec4 color;
      void main () {
        gl_FragColor = color;
      }`,

      vert: `
      precision mediump float;

      uniform float uWidth;
      uniform float uHeight;
      uniform float uPixelRatio;
      uniform float uTime;

      attribute vec2 from;
      attribute vec2 to;

      attribute vec4 colorFrom;
      attribute vec4 colorTo;

      vec2 screen2clip(vec2 position, vec2 resolution) {
        return vec2(
          position.x * uPixelRatio / resolution.x * 2.0 - 1.0,
          position.y * uPixelRatio / resolution.y * -2.0 + 1.0
        );
      }

      void main () {
        vec2 position = (to - from) * uTime + from;
        vec2 clip = screen2clip(position, vec2(uWidth, uHeight));

        gl_Position = vec4(clip, 0, 1);
      }`,

      uniforms: {
        color: [1, 0, 0, 1],

        uPixelRatio: regl.context('pixelRatio'),
        uWidth: regl.context('viewportWidth'),
        uHeight: regl.context('viewportHeight'),

        uTime: regl.prop('elapsed')
      },

      attributes: {
        from,
        to
      },

      depth: {
        enable: false
      },

      primitive: 'triangles',

      // Every triangle is just three vertices.
      // However, every such triangle are drawn N * N times,
      // through instancing.
      count: 8 * 2 * 3,
    });

    scheduler.on('start', function() {
      regl.clear({
        color: [0, 0, 0, 0],
        depth: 1
      });
    });
  }

  advance(args) {
    const { motions } = args;

    // TODO push attributes here

    super.advance(args, {
      enter(from, to, key, duration, easing) {
        // construct models here
        // the shader should have 2 attributes that represents to and
        motions.set(key, new Motion({
          from,
          to,
          duration,
          easing,

          append: true
        }));
      },

      update(from, to, key, duration, easing) {
        // NOTE We have no way to know where "from" is,
        // maybe from last buffer?
        // We have last rendered time,
        // We may have to re-interpolate from that
      },

      exit(from, to, key, duration, easing) {
      }
    });

    const triangles = Array.from(motions.values(), motion => {
      return {
        from: motion.from.triangles(),
        to: motion.to.triangles()
      };
    });

    this.from(Array.from({
      *[Symbol.iterator]() {
        for (let { from } of triangles) {
          yield* from;
        }
      }
    }));
    this.to(Array.from({
      *[Symbol.iterator]() {
        for (let { to } of triangles) {
          yield* to;
        }
      }
    }));
    this.start = now();
  }

  render(time, { motions }) {
    const duration = 250;
    const elapsed = Math.min(1, (time - this.start) / duration);

    // batch run from here
    // TODO push time here
    this.program({
      elapsed
    });
  }
}
