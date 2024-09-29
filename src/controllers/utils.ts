import type { LinearScale, RadialLinearScale, Scale } from 'chart.js';
import type { IErrorBarRDataPoint, IErrorBarXYDataPoint } from './base';

export const allModelKeys = ['xMin', 'xMax', 'yMin', 'yMax'];

export function modelKeys(horizontal: boolean): (keyof IErrorBarXYDataPoint)[] {
  return (horizontal ? allModelKeys.slice(0, 2) : allModelKeys.slice(2)) as any;
}

export function calculateScale(
  properties: any,
  data: Partial<IErrorBarXYDataPoint>,
  index: number,
  scale: LinearScale,
  reset?: boolean
): void {
  const keys = [`${scale.axis}Min`, `${scale.axis}Max`] as const;
  const base = scale.getBasePixel();

  for (const key of keys) {
    const v = data[key as keyof IErrorBarXYDataPoint];
    if (Array.isArray(v)) {
      properties[key] = v.map((d) => (reset ? base : scale.getPixelForValue(d, index)));
    } else if (typeof v === 'number') {
      properties[key] = reset ? base : scale.getPixelForValue(v, index);
    } else {
      properties[key] = null; // reset
    }
  }
}

export function calculatePolarScale(
  properties: any,
  data: IErrorBarRDataPoint,
  scale: RadialLinearScale,
  reset: boolean,

  options: any
): void {
  const animationOpts = options.animation;
  const keys = [`${scale.axis}Min`, `${scale.axis}Max`];

  const toAngle = (v: number) => {
    const valueRadius = scale.getDistanceFromCenterForValue(v);
    const resetRadius = animationOpts.animateScale ? 0 : valueRadius;
    return reset ? resetRadius : valueRadius;
  };

  for (const key of keys) {
    const v = data[key as keyof IErrorBarRDataPoint];
    if (Array.isArray(v)) {
      properties[key] = v.map(toAngle);
    } else if (typeof v === 'number') {
      properties[key] = toAngle(v);
    } else {
      properties[key] = null; // reset
    }
  }
}

const NUMERIC_SCALE_TYPES = ['linear', 'logarithmic', 'time', 'timeseries'];

export function isNumericScale(scale: Scale): boolean {
  return NUMERIC_SCALE_TYPES.includes(scale.type);
}
