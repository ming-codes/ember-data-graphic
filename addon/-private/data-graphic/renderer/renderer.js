import { createGeometryFactoryFor } from '../geometry-factory';

import { resolve as resolveEasing } from '../easing';

import { get } from '@ember/object';

const noop = Function.prototype;

export class Renderer {
  constructor(context, scheduler) {
    this.context = context;
    this.scheduler = scheduler;
  }

  createWrappedNodeFrom(node, wrapper) {
    if (typeof wrapper === 'function') {
      return wrapper(node);
    } else if (typeof wrapper === 'object') {
      return Object.create(node, Object.getOwnPropertyDescriptors(wrapper));
    } else {
      return node;
    }
  }

  join({ data, key, type, geometry, motions, lookup }) {
    const { length } = data;

    const exitKeys = new Set(motions.keys());

    const enter = new Map();
    const exit = new Map();
    const update = new Map();

    const factory = createGeometryFactoryFor(type, geometry);
    const mapKeyAccessor = this.mapKeyAccessor(key);

    for (let index = 0; index < length; index++) {
      const datum = data[index];
      const mapKey = mapKeyAccessor(datum, index);

      lookup.set(mapKey, datum);

      if (motions.has(mapKey)) {
        exitKeys.delete(mapKey);

        update.set(mapKey, factory.create(datum));
      } else {
        enter.set(mapKey, factory.create(datum));
      }
    }

    exitKeys.forEach(key => {
      exit.set(key, factory.create(lookup.get(key)));

      lookup.delete(key);
    });

    return [ enter, update, exit ];
  }

  mapKeyAccessor(key) {
    switch (key) {
      case '@index': return ((datum, index) => index);
      case '@identity': return (datum => datum);
      default: return (datum => get(datum, key));
    }
  }

  measure() {
  }

  advance(args, { enter = noop, update = noop, exit = noop }) {
    const [ enterNodeMap, updateNodeMap, exitNodeMap ] = this.join(args);
    const { motions } = args;
    const { duration } = args.motion;

    const easing = resolveEasing(args.motion.easing);

    this.scheduler.advance(Number(duration ?? 0));

    for (let [ mapKey, enterSceneNode ] of enterNodeMap.entries()) {
      const from = this.createWrappedNodeFrom(enterSceneNode, args.lifecycle.onEnter);
      const to = enterSceneNode;

      enter.call(this, from, to, mapKey, duration, easing);
    }

    for (let [ mapKey, updateSceneNode ] of updateNodeMap.entries()) {
      const from = motions.get(mapKey);
      const to = this.createWrappedNodeFrom(updateSceneNode, args.lifecycle.onUpdate);

      update.call(this, from, to, mapKey, duration, easing);
    }

    for (let [ mapKey ] of exitNodeMap.entries()) {
      const { object: from } = motions.get(mapKey);
      const to = this.createWrappedNodeFrom(from, args.lifecycle.onExit)

      exit.call(this, from, to, mapKey, duration, easing);
    }
  }

  render() {
  }
}

