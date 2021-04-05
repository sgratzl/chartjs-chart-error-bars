import { color } from 'chart.js/helpers';
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
  from: T | T[] | { v: T[] },
  to: T | T[] | { v: T[] },
  factor: number,
  type: 'string' | 'number',
  interpolator: (from: T, to: T, factor: number) => T
):
  | T
  | T[]
  | {
      v: T[];
    } {
  if (typeof from === type && typeof to === type) {
    return interpolator(from as T, to as T, factor);
  }
  if (Array.isArray(from) && Array.isArray(to)) {
    return from.map((f, i) => interpolator(f, to[i], factor));
  }
  const isV = (t: T | T[] | { v: T[] }): t is { v: T[] } => t && Array.isArray((t as { v: T[] }).v);

  if (isV(from) && isV(to)) {
    return { v: from.v.map((f, i) => interpolator(f, to.v[i], factor)) };
  }
  return to;
}

function interpolateNumberOptionArray(
  from: number[],
  to: number[],
  factor: number
): number | number[] | { v: number[] } {
  return interpolateArrayOption(from, to, factor, 'number', interpolators.number);
}

function interpolateColorOptionArray(
  from: string[],
  to: string[],
  factor: number
): string | string[] | { v: string[] } {
  return interpolateArrayOption(from, to, factor, 'string', interpolators.color);
}

export const animationHints = {
  animations: {
    numberArray: {
      fn: interpolateNumberOptionArray,
      properties: allModelKeys.concat(
        styleKeys.filter((d) => !d.endsWith('Color')),
        ['rMin', 'rMax']
      ),
    },
    colorArray: {
      fn: interpolateColorOptionArray,
      properties: styleKeys.filter((d) => d.endsWith('Color')),
    },
  },
};

export default animationHints;
