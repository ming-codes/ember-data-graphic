import { helper } from '@ember/component/helper';
import * as d3 from 'd3-format';

export default helper(function format([ template ]) {
  return d3.format(template);
});
