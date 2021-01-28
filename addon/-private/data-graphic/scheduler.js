import { registerDestructor } from '@ember/destroyable';

import { now, Timer } from './timer';

function add(arr, item) {
  arr.push(item);
}

function remove(arr, item) {
  arr.splice(arr.indexOf(item), 1);
}

export class AnimationFrameScheduler {
  #timer = new Timer();
  #renderables = [];
  #listeners = {
    start: [],
    end: []
  };

  expiration = 0;

  constructor() {
    registerDestructor(this, () => {
      this.#timer.stop();
    });
  }

  on(type, fn) {
    add(this.#listeners[type], fn);
  }

  off(type, fn) {
    remove(this.#listeners[type], fn);
  }

  register(renderable) {
    add(this.#renderables, renderable);

    return renderable;
  }

  unregister(renderable) {
    remove(this.#renderables, renderable);

    return renderable;
  }

  flush(time) {
    const { start, end } = this.#listeners;
    const renderables = this.#renderables;

    console.time('flush');
    for (let index = renderables.length - 1; index >= 0; index--) {
      renderables[index].measure(time);
    }

    for (let fn of start) {
      fn(time);
    }

    for (let index = renderables.length - 1; index >= 0; index--) {
      renderables[index].render(time);
    }

    for (let fn of end) {
      fn(time);
    }
    console.timeEnd('flush');

    for (let index = renderables.length - 1; index >= 0; index--) {
      if (renderables[index].isDestroying) {
        this.unregister(renderables[index]);
      }
    }
  }

  advance(duration) {
    duration = this.expiration = Math.max(this.expiration, duration);

    this.#timer.restart(elapsed => {
      this.expiration = 0;

      try {
        this.flush(now());
      } finally {
        if (elapsed > duration) {
          this.#timer.stop();
        }
      }
    }, 0, now());
  }
}
