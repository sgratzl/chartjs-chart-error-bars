import { IScaleOptions, Scale } from 'chart.js';

export function getMinMax(
  scale: Scale<IScaleOptions>,
  canStack: boolean,
  superMethod: (scale: Scale<IScaleOptions>, canStack: boolean) => { min: number; max: number }
) {
  const axis = scale.axis;
  scale.axis = `${axis}MinMin`;
  const min = superMethod(scale, canStack).min;
  scale.axis = `${axis}MaxMax`;
  const max = superMethod(scale, canStack).max;
  scale.axis = axis;
  return { min, max };
}

function computeExtrema(v, vm, op) {
  if (Array.isArray(vm)) {
    return op(...vm);
  }
  if (typeof vm === 'number') {
    return vm;
  }
  return v;
}

export function parseErrorNumberData(parsed, scale, data, start, count) {
  const axis = typeof scale === 'string' ? scale : scale.axis;
  const vMin = `${axis}Min`;
  const vMax = `${axis}Max`;
  const vMinMin = `${axis}MinMin`;
  const vMaxMax = `${axis}MaxMax`;
  for (let i = 0; i < count; i++) {
    const index = i + start;
    const p = parsed[i];
    p[vMin] = data[index][vMin];
    p[vMax] = data[index][vMax];
    p[vMinMin] = computeExtrema(p[axis], p[vMin], Math.min);
    p[vMaxMax] = computeExtrema(p[axis], p[vMax], Math.max);
  }
}
export function parseErrorLabelData(parsed, scale, start, count) {
  const axis = scale.axis;
  const labels = scale.getLabels();
  for (let i = 0; i < count; i++) {
    const index = i + start;
    const p = parsed[i];
    p[axis] = scale.parse(labels[index], index);
  }
}
