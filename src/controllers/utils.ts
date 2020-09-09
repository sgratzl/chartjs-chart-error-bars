import { IScaleOptions, LinearScale, Scale } from 'chart.js';

export const allModelKeys = ['xMin', 'xMax', 'yMin', 'yMax'];

export function modelKeys(horizontal: boolean) {
  return horizontal ? allModelKeys.slice(0, 2) : allModelKeys.slice(2);
}

export function calculateScale(properties, data, scale: LinearScale, reset?: boolean) {
  const keys = [`${scale.axis}Min`, `${scale.axis}Max`];
  const base = scale.getBasePixel();

  for (const key of keys) {
    const v = data[key];
    if (Array.isArray(v)) {
      properties[key] = v.map((d) => (reset ? base : scale.getPixelForValue(d)));
    } else if (typeof v === 'number') {
      properties[key] = reset ? base : scale.getPixelForValue(v);
    }
  }
}

export function calculatePolarScale(arc, properties, data, scale, reset, options) {
  const animationOpts = options.animation;
  const keys = [`${scale.axis}Min`, `${scale.axis}Max`];

  const toAngle = (v) => {
    const valueRadius = scale.getDistanceFromCenterForValue(v);
    const resetRadius = animationOpts.animateScale ? 0 : valueRadius;
    return reset ? resetRadius : valueRadius;
  };

  for (const key of keys) {
    const v = data[key];
    if (Array.isArray(v)) {
      properties[key] = v.map(toAngle);
    } else if (typeof v === 'number') {
      properties[key] = toAngle(v);
    }
  }
}
