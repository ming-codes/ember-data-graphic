import Component from '@glimmer/component';

import { tracked } from '@glimmer/tracking';

import { action } from '@ember/object';

import { max } from 'd3-array';

export default class ExampleBarChartComponent extends Component {
  // BEGIN-SNIPPET data-graphic-bars-controller.js
  @tracked barsDataOrder = 0; // -1, 0, 1

  @tracked barsData = [
    { category: "A", amount: 28 },
    { category: "B", amount: 55 },
    { category: "C", amount: 43 },
    { category: "D", amount: 91 },
    { category: "E", amount: 81 },
    { category: "F", amount: 53 },
    { category: "G", amount: 19 },
    { category: "H", amount: 87 }
  ];
  @tracked barsDataHighlight = null;

  get barsDataExtent() {
    return [ 0, max(this.barsData, datum => datum.amount) ];
  }

  get barsDataSorted() {
    const { barsData, barsDataOrder, barsDataHighlight } = this;

    return barsData
      .map(datum => {
        if (datum === barsDataHighlight) {
          datum.fill = 'tomato'
        } else {
          datum.fill = 'steelblue'
        };

        return datum;
      })
      .sort((left, right) => {
        return (left.amount - right.amount) * barsDataOrder;
      });
  }

  get barsDataSortedDomain() {
    return this.barsDataSorted.map(bar => bar.category);
  }

  @action
  onBarsDataSort() {
    this.barsDataOrder = (this.barsDataOrder + 2) % 3 - 1;
  }

  @action
  onBarsDataPush() {
    const last = this.barsData[this.barsData.length - 1];
    const cat = String.fromCharCode(last.category.charCodeAt(0) + 1);
    const [ min, max ] = this.barsDataExtent;

    this.barsData = [ ...this.barsData, {
      category: cat,
      amount: Math.floor(max * 1.2)
    } ];
  }

  @action
  onBarsDataPop() {
    this.barsData = this.barsData.slice(0, this.barsData.length - 1);
  }
  // END-SNIPPET

  @action
  onBarClick(datum) {
    if (this.barsDataHighlight === datum) {
      this.barsDataHighlight = null;
    } else {
      this.barsDataHighlight = datum;
    }
  }
}
