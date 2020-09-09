import { color } from 'chart.js';
import { styleKeys } from './elements/render';
import { allModelKeys } from './controllers/utils';

const interpolators = {
  color(from: string, to: string, factor: number) {
    const f = from || 'transparent';
    const t = to || 'transparent';
    if (f === t) {
      return to;
    }
    const c0 = color(f);
    const c1 = c0.valid && color(t);
    return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
  },
  number(from: number, to: number, factor: number) {
    if (from === to) {
      return to;
    }
    return from + (to - from) * factor;
  },
};

function interpolateArrayOption<T>(
  from: T[],
  to: T[],
  factor: number,
  type: 'string' | 'number',
  interpolator: (from: T, to: T, factor: number) => T
) {
  if (typeof from === type && typeof to === type) {
    return interpolator(from, to, factor);
  }
  if (Array.isArray(from) && Array.isArray(to)) {
    return from.map((f, i) => interpolator(f, to[i], factor));
  }
  if (from && Array.isArray(from.v) && to && Array.isArray(to.v)) {
    return from.v.map((f, i) => interpolator(f, to.v[i], factor));
  }
  return to;
}

function interpolateNumberOptionArray(from, to, factor) {
  return interpolateArrayOption(from, to, factor, 'number', interpolators.number);
}

function interpolateColorOptionArray(from, to, factor) {
  return interpolateArrayOption(from, to, factor, 'string', interpolators.color);
}

export const animationHints = {
  datasets: {
    animation: {
      numberArray: {
        fn: interpolateNumberOptionArray,
        properties: allModelKeys.concat(
          styleKeys.filter((d) => !d.endsWith('Color')),
          ['rMin', 'rMax']
        ),
      },
      colorArray: {
        fn: interpolateColorOptionArray,
        properties: allModelKeys.concat(styleKeys.filter((d) => d.endsWith('Color'))),
      },
    },
  },
};
