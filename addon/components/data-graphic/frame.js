import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import { AnimationFrameScheduler } from 'ember-data-graphic/-private/data-graphic/scheduler';
import { InteractionManager } from 'ember-data-graphic/-private/data-graphic/interaction';

class DataGraphicFrameModel {
  @tracked width;
  @tracked height;

  @tracked hover = null;

  @tracked layer = null;

  get HOVER() {
    return this.hover;
  }

  get WIDTH() {
    return this.width;
  }

  get HEIGHT() {
    return this.height;
  }

  get Layer() {
    return this.layer;
  }
}

export default class DataGraphicFrameComponent extends Component {
  model = new DataGraphicFrameModel();

  get ready() {
    return this.model.width && this.model.height;
  }

  resize = new ResizeObserver(([ { contentBoxSize } ]) => {
    const [ size ] = contentBoxSize;
    const width = size.inlineSize * devicePixelRatio;
    const height = size.blockSize * devicePixelRatio;

    if (this.model.width !== width) {
      this.model.width = width;
    }

    if (this.model.height !== height) {
      this.model.height = height;
    }
  });

  @action
  didInsert(element) {
    this.scheduler = new AnimationFrameScheduler();
    this.interaction = new InteractionManager(element);

    this.resize.observe(element);

    element.addEventListener('pointermove', evt => {
      this.model.hover = {
        X: evt.offsetX * devicePixelRatio,
        Y: evt.offsetY * devicePixelRatio
      };
    });

    element.addEventListener('pointerout', evt => {
      this.model.hover = null;
    });
  }

  @action
  didUpdateFrameModel(layer) {
    if (this.model.layer !== layer) {
      this.model.layer = layer;
    }

    return this.model;

    //(hash
    //  WIDTH=this.width
    //  HEIGHT=this.height
    //  HOVER=this.hover
    //  Layer=
    //)
  }

// @onPointerOver
// @onPointerOut
// @onPointerMove
// @onClick

  willDestroy() {
    this.resize.disconnect();
  }
}
