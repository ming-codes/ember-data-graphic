import Component from '@glimmer/component';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import * as d3 from 'd3-sankey';
import { max } from 'd3-array';

import { action } from '@ember/object';

export default class ExampleSankeyComponent extends Component {
  // BEGIN-SNIPPET data-graphic-sankey-controller.js
  data = {
    nodes: [
      {node:0,name:"node0"},
      {node:1,name:"node1"},
      {node:2,name:"node2"},
      {node:3,name:"node3"},
      {node:4,name:"node4"}
    ],
    links: [
      {source:0,target:2,value:2},
      {source:1,target:2,value:2},
      {source:1,target:3,value:2},
      {source:0,target:4,value:2},
      {source:2,target:3,value:2},
      {source:2,target:4,value:2},
      {source:3,target:4,value:4}
    ]
  };

  sankey = d3.sankey();

  link = d3.sankeyLinkHorizontal();
  // END-SNIPPET
}
