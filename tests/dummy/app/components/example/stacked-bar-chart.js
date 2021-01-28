import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import * as d3 from 'd3-shape';
import { max } from 'd3-array';

const STACKED = 0;
const GROUPED = 1;

export default class ExampleStackedBarChartComponent extends Component {
  @tracked mode = GROUPED;

  data = [
    { category: "A", apple: 28, orange: 12 },
    { category: "B", apple: 55, orange: 84 },
    { category: "C", apple: 43, orange: 48 },
    { category: "D", apple: 91, orange: 41 },
    { category: "E", apple: 81, orange: 10 },
    { category: "F", apple: 53, orange: 48 },
    { category: "G", apple: 19, orange: 68 },
    { category: "H", apple: 87, orange: 36 }
  ];

  stack = d3.stack()
    .keys([ 'apple', 'orange' ]);

  get isStacked() {
    return this.mode === STACKED;
  }

  get isGrouped() {
    return this.mode === GROUPED;
  }

  get stacked() {
    const [ apple, orange ] = this.stack(this.data);

    return [
      ...apple.map(({ data, ...properties }) => {
        return {
          id: `${data.category}_apple`,
          category: data.category,
          type: 'apple',
          fill: 'steelblue',
          ...properties
        };
      }),
      ...orange.map(({ data, ...properties }) => {
        return {
          id: `${data.category}_orange`,
          category: data.category,
          type: 'orange',
          fill: 'tomato',
          ...properties
        };
      })
    ];
  }

  get grouped() {
    return this.data.flatMap(({ category, apple, orange }) => {
      return [
        {
          id: `${category}_apple`,
          category: category,
          fill: 'steelblue',
          type: 'apple',
          '0': 0,
          '1': apple
        },
        {
          id: `${category}_orange`,
          category: category,
          fill: 'tomato',
          type: 'orange',
          '0': 0,
          '1': orange
        }
      ];
    });
  }

  get domain() {
    return this.data.map(datum => datum.category);
  }

  get range() {
    return [ 0, max(this.data, datum => datum.apple + datum.orange) ];
  }

  @action
  onStack() {
    this.mode = STACKED;
  }

  @action
  onGroup() {
    this.mode = GROUPED;
  }
}
