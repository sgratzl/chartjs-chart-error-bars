import type { LinearScale, RadialLinearScale } from 'chart.js';
import type { IErrorBarRDataPoint, IErrorBarXYDataPoint } from './base';

export const allModelKeys = ['xMin', 'xMax', 'yMin', 'yMax'];

export function modelKeys(horizontal: boolean): (keyof IErrorBarXYDataPoint)[] {
  return (horizontal ? allModelKeys.slice(0, 2) : allModelKeys.slice(2)) as any;
}

export function calculateScale(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
      // eslint-disable-next-line no-param-reassign
      properties[key] = v.map((d) => (reset ? base : scale.getPixelForValue(d, index)));
    } else if (typeof v === 'number') {
      // eslint-disable-next-line no-param-reassign
      properties[key] = reset ? base : scale.getPixelForValue(v, index);
    }
  }
}

export function calculatePolarScale(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  properties: any,
  data: IErrorBarRDataPoint,
  scale: RadialLinearScale,
  reset: boolean,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
      // eslint-disable-next-line no-param-reassign
      properties[key] = v.map(toAngle);
    } else if (typeof v === 'number') {
      // eslint-disable-next-line no-param-reassign
      properties[key] = toAngle(v);
    }
  }
}
