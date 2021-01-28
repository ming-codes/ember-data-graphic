import { interpolateObject } from 'd3-interpolate';

import { now } from './timer';

export class Motion {
  constructor({ from, to, duration, easing, ...properties }) {
    const start = now();

    if (duration) {
      const fn = interpolateObject(from instanceof Motion ? from.object : from, to);
      const object = fn(1);

      object.tagName = to.tagName;
      object.namespaceURI = to.namespaceURI;
      object.toPath = to.toPath;
      object.toPathString = to.toPathString;

      this.from = from;
      this.to = to;
      this.object = object;
      this.duration = duration ?? 0;
      this.expiration = start + this.duration;

      this.interpolate = now => {
        return fn(easing(this.playhead = Math.min(1, (now - start) / this.duration)))
      };
    } else {
      this.from = from;
      this.to = to;
      this.object = to;
      this.duration = duration ?? 0;
      this.expiration = start + this.duration;

      this.interpolate = () => {
        this.playhead = 1;
        return to;
      };
    }

    Object.assign(this, properties);
  }
}

