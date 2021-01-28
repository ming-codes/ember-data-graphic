import { helper } from '@ember/component/helper';

export default helper(function compose(params) {
  let len = params.length;

  return function(datum, ...argv) {
    for (let index = 0; index < len; index++) {
      datum = params[index](datum, ...argv);
    }

    return datum;
  }
});
