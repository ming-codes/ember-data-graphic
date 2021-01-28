import Component from '@glimmer/component';
import { action } from '@ember/object';
import { camelize } from '@ember/string';
import { scheduleOnce } from '@ember/runloop';

import { identity } from 'ember-data-graphic/-private/data-graphic/fn';

//import { create } from 'd3-selection';
//import * as d3 from 'd3-axis';
//import 'd3-transition';

const CONTINOUS = 0;
const DISCRETE = 1;

function number(scale) {
  return d => +scale(d);
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return +scale(d) + offset;
  };
}

export default class DataGraphicAxisComponent extends Component {
  //element = create('svg:g');

  get axis() {
    const axis = d3[camelize(`axis-${this.args.orient}`)]();

    axis.scale(this.args.scale);

    return axis;
  }

  get scaleType() {
    return this.args.scale.ticks ? CONTINOUS : DISCRETE;
  }

  get tickEnterPosition() {
    const { scaleType } = this;
    const { orient } = this.args;

    // continous scale should enter at position of previous scale

    //if (scaleType === CONTINOUS)
  }

  get tickSizeInner() {
    const { tickSizeInner, tickSize } = this.args;

    return tickSizeInner ?? tickSize ?? 6;
  }

  get tickSizeOuter() {
    const { tickSizeOuter, tickSize } = this.args;

    return tickSizeOuter ?? tickSize ?? 6;
  }

  get tickPadding() {
    return this.args.tickPadding ?? 3;
  }

  get duration() {
    return this.args.duration ?? 0;
  }

  get easing() {
    return this.args.easing ?? 'linear';
  }

  get stroke() {
    return this.args.stroke ?? 'currentColor';
  }

  get strokeWidth() {
    return this.args.strokeWidth ?? 1;
  }

  get domain() {
    switch (this.args.orient) {
      case 'top': return {
        x1(datum) {
          return datum[0];
        },
        x2(datum) {
          return datum[1];
        },
        y1: 0,
        y2: 0
      };
      case 'bottom': return {
        x1(datum) {
          return datum[0];
        },
        x2(datum) {
          return datum[1];
        },
        y1: 0,
        y2: 0
      };
      case 'left': return {
        x1: 0,
        x2: 0,
        y1(datum) {
          return datum[0];
        },
        y2(datum) {
          return datum[1];
        }
      };
      case 'right': return {
        x1: 0,
        x2: 0,
        y1(datum) {
          return datum[0];
        },
        y2(datum) {
          return datum[1];
        }
      };
    }
  }

  get tickInner() {
    const range = this.args.scale.range();

    switch (this.args.orient) {
      case 'top': return {
        x1: this.args.scale,
        x2: this.args.scale,
        y1: 0,
        y2: this.tickSizeInner * -1
      };
      case 'bottom': return {
        x1: this.args.scale,
        x2: this.args.scale,
        y1: 0,
        y2: this.tickSizeInner
      };
      case 'left': return {
        x1: 0,
        x2: this.tickSizeInner * -1,
        y1: this.args.scale,
        y2: this.args.scale
      };
      case 'right': return {
        x1: 0,
        x2: this.tickSizeInner,
        y1: this.args.scale,
        y2: this.args.scale
      };
    }
  }

  get tickOuter() {
    const { span, tickPadding, tickSizeOuter } = this;

    switch (this.args.orient) {
      case 'top': return {
        x1(datum) {
          return datum;
        },
        x2(datum) {
          return datum;
        },
        y1: 0,
        y2: tickSizeOuter * -1
      };
      case 'bottom': return {
        x1(datum) {
          return datum;
        },
        x2(datum) {
          return datum;
        },
        y1: 0,
        y2: tickSizeOuter
      };
      case 'left': return {
        x1: 0,
        x2: tickSizeOuter * -1,
        y1(datum) {
          return datum;
        },
        y2(datum) {
          return datum;
        }
      };
      case 'right': return {
        x1: 0,
        x2: tickSizeOuter,
        y1(datum) {
          return datum;
        },
        y2(datum) {
          return datum;
        }
      };
    }
  }

  get tickText() {
    const { tickSizeInner, tickPadding } = this;
    const { scale } = this.args;
    const position = scale.bandwidth ? center : number;

    switch (this.args.orient) {
      case 'top': return {
        x: position(scale),
        y: (tickSizeInner + tickPadding) * -1,
        dy: '0em',
        textAnchor: 'middle',
        textContent: this.args.tickFormat ?? identity
      };
      case 'bottom': return {
        x: position(scale),
        y: tickSizeInner + tickPadding,
        dy: '0.71em',
        textAnchor: 'middle',
        textContent: this.args.tickFormat ?? identity
      };
      case 'left': return {
        x: (tickSizeInner + tickPadding) * -1,
        y: position(scale),
        dy: '0.31em',
        textAnchor: 'end',
        textContent: this.args.tickFormat ?? identity
      };
      case 'right': return {
        x: tickSizeInner + tickPadding,
        y: position(scale),
        dy: '0.31em',
        textAnchor: 'start',
        textContent: this.args.tickFormat ?? identity
      };
    }
  }

  get data() {
    const { scale } = this.args;
    const ticks = scale.ticks ? scale.ticks() : scale.domain();

    return ticks;
  }

  get span() {
    return this.args.scale.range();
  }

  @action
  renderer() {
    this
      .element
      .datum(this.args.scale)
      .attr('transform', this.args.transform)
      .transition()
      .call(this.axis);

    return this.element.node();
  }

  @action
  onTickEnter(node) {
    if (this.previousScale && this.args.scale?.invert) {
      const { scale } = this.args;

      return {
        ...node,

        y: ('y' in node) && this.previousScale(scale.invert(node.y)),
        y1: ('y1' in node) && this.previousScale(scale.invert(node.y1)),
        y2: ('y2' in node) && this.previousScale(scale.invert(node.y2)),
        opacity: 0.0001
      };
    }

    scheduleOnce('afterRender', this, 'advanceScale', this.args.scale);

    return {
      ...node,

      opacity: 0.0001
    };
  }

  advanceScale(scale) {
    this.previousScale = scale;
  }
}
