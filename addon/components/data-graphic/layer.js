import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';
import { associateDestroyableChild } from '@ember/destroyable'

import { RendererForSVG } from 'ember-data-graphic/-private/data-graphic/renderer/svg';
import { RendererForCanvas2D } from 'ember-data-graphic/-private/data-graphic/renderer/canvas-2d';
import { RendererForCanvasWebGL } from 'ember-data-graphic/-private/data-graphic/renderer/canvas-webgl';

const FACTORIES = {
  'svg': RendererForSVG,
  '2d': RendererForCanvas2D,
  'webgl': RendererForCanvasWebGL
};

export default class DataGraphicLayerComponent extends Component {
  @tracked context;
  @tracked renderer;

  get shouldRenderCanvas() {
    return ['2d', 'webgl', 'webgl2'].includes(this.args.renderer);
  }

  get shouldRenderSVG() {
    return this.args.renderer === 'svg';
  }

  @action
  setContextFrom(element) {
    const { renderer, scheduler, ...args } = this.args;
    const factory = FACTORIES[renderer];

    this.context = element instanceof HTMLCanvasElement ? element.getContext(renderer, args) : element;

    if (factory) {
      this.renderer = new factory(this.context, scheduler);

      associateDestroyableChild(this, this.renderer);
    }
  }
}
