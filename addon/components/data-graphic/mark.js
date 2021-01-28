import Component from '@glimmer/component';
import { action } from '@ember/object';
import { camelize } from '@ember/string';

const EVENTS = [ 'click' ];

export default class DataGraphicMarkComponent extends Component {
  morphStart = document.createComment('element start');
  morphEnd = document.createComment('element end');

  lookup = new Map();
  motions = new Map();
  elements = new Map();

  constructor(...argv) {
    super(...argv);

    const { renderer, scheduler, interaction } = this.args;

    scheduler.register(this);

    EVENTS.forEach(type => {
      const key = camelize(`on-${type}`);
      const handler = this.args[key];

      if (handler) {
        interaction.on(type, ({ offsetX, offsetY, screenX, screenY }) => {
          handler(renderer.datumFromPoint({ offsetX, offsetY, screenX, screenY }, this.spread));
        });
      }
    });
  }

  get spread() {
    const { args, morphStart, morphEnd, lookup, motions, elements } = this;
    // this makes sure we trigger all the refs
    const { scheduler, interaction, duration, easing, delay, data, key = '@identity', type, onEnter, onUpdate, onExit, onClick, ...rest } = args;

    return {
      type,
      data: this.isDestroying ? [] : data,
      key,

      scheduler,
      interaction,
      lookup,
      motions,
      elements,

      morph: {
        start: morphStart,
        end: morphEnd
      },

      motion: {
        duration,
        easing,
        delay
      },

      lifecycle: {
        onEnter,
        onUpdate,
        onExit,
      },

      events: {
        onClick
      },

      geometry: rest
    };
  }

  @action
  advance() {
    //console.time('advance');
    this.args.renderer.advance(this.spread);
    //console.timeEnd('advance');
  }

  @action
  measure(time) {
    this.args.renderer.measure(time, this.spread);
  }

  @action
  render(time) {
    this.args.renderer.render(time, this.spread);
  }

  willDestroy() {
    EVENTS.forEach(type => {
      const key = camelize(`on-${type}`);
      const handler = this.args[key];

      if (handler) {
        // TODO handle unregister events
      }
    });

    this.advance();
  }
}
