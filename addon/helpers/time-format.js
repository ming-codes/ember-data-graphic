import { helper } from '@ember/component/helper';
import * as d3 from 'd3-time-format';

export default helper(function timeFormat([ template ]) {
  return d3.timeFormat(template);
});
