const SVG = 'http://www.w3.org/2000/svg';
const parseHelper = document.createElementNS(SVG, "g");
const parseCache = new Map();
const parseIdentity = [ 1, 0, 0, 1, 0, 0 ];

export function parseTransformString(value) {
  if (!value) {
    return [ ...parseIdentity ];
  }

  if (parseCache.has(value)) {
    return [ ...parseCache.get(value) ];
  }

  parseHelper.setAttribute('transform', value);

  const consolidated = parseHelper.transform.baseVal.consolidate();

  if (!consolidated) {
    return [ ...parseIdentity ];
  }

  const { a, b, c, d, e, f } = consolidated.matrix;

  parseCache.set(value, [ a, b, c, d, e, f ]);

  return [ a, b, c, d, e, f ];
}

export function parseRelativeSize(fontSize, ...sizes) {
  return sizes.map(size => {
    if (!isNaN(size)) {
      return Number(size);
    }

    if (size.endsWith('em')) {
      return parseFloat(size) * fontSize;
    }

    if (size.endsWith('px')) {
      return parseFloat(size);
    }

    return size;
  });
}
