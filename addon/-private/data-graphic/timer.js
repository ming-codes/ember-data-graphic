import { timer } from 'd3-timer';

export const Timer = (function() {
  const inst = timer(Function.prototype);

  inst.stop();

  return inst.constructor;
})();

export { now } from 'd3-timer';
