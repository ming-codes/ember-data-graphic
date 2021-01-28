import { helper } from '@ember/component/helper';
import { Parser } from 'expr-eval';
import { functor, compute, identity } from 'ember-data-graphic/-private/data-graphic/fn';

const parser = new Parser();
const cache = new Map();

function getInstance(expr) {
  if (cache.has(expr)) {
    return cache.get(expr);
  }

  return cache.set(expr, parser.parse(expr)).get(expr);
}

export default helper(function expr([ expression ], hash) {
  const instance = getInstance(expression);

  return function expr(vars = {}) {
    const variables = {};
    const keys = instance.variables();
    const len = keys.length;

    for (let index = 0; index < len; index++) {
      const key = keys[index];

      if (key in hash) {
        variables[key] = compute(hash[key], vars);
      } else {
        variables[key] = vars;
      }
    }

    return instance.evaluate(variables);
  }
});
