import Component from '@glimmer/component';

import { max, extent } from 'd3-array';
import { line } from 'd3-shape';

import faker from 'faker';

const Random = faker.random.constructor;

const MINUTE = 60000;

export default class ExampleLineChartComponent extends Component {
  // BEGIN-SNIPPET data-graphic-lines-controller.js
  data = Array.from({
    *[Symbol.iterator]() {
      const anchor = Date.UTC(2020);
      const series = Array.from({ length: 126 }, () => []);

      faker.seed(2020);

      for (let index = 0; index < 480; index++) {
        const timestamp = anchor + index * MINUTE;

        series.forEach(series => {
          series.push([ timestamp, faker.random.number(10000 * (1 + Math.floor(index * 5 / 480))) ]);
        });
      }

      yield* series;
    }
  });

  get domain() {
    const anchor = Date.UTC(2020);

    return [ anchor, anchor + 480 * MINUTE ];
  }

  get range() {
    return [ 0, 60000 ];
  }

  get line() {
    const layout = line();

    return (xScale, yScale) => {
      return line()
        .x(datum => xScale(datum[0]))
        .y(datum => yScale(datum[1]));
    };
  }
  // END-SNIPPET
}
