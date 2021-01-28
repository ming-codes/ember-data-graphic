import { helper } from '@ember/component/helper';

export default helper(function template([ str, ...rest ], hash) {
  const params = {
    ...rest,
    ...hash
  };

  return str.replace(/{([\w+])}/g, function(match, key) {
    return params[key] ?? match;
  });
});
