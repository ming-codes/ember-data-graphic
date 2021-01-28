
export class InteractionManager {
  static NATIVE_SYMBOL = Symbol();

  #listeners = {};
  #source = null;

  constructor(source) {
    this.#source = source;
  }

  on(type, callback) {
    if (!this.#listeners[type]) {
      const listeners = this.#listeners[type] = new Set();

      this.#source.addEventListener(type, this.#listeners[type][InteractionManager.NATIVE_SYMBOL] = function (evt) {
        listeners.forEach(listener => {
          listener(evt);
        });
      });
    }

    this.#listeners[type].add(callback);
  }

  off(type, callback) {
    if (this.#listeners[type]) {
      this.#listeners[type].delete(callback);
    }

    if (!this.#listeners[type].size) {
      this.#source.removeEventListener(type, this.#listeners[type][InteractionManager.NATIVE_SYMBOL]);

      delete this.#listeners[type][InteractionManager.NATIVE_SYMBOL];
      delete this.#listeners[type];
    }
  }
}

