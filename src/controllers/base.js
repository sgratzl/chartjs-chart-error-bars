export function getMinMax(scale, canStack, superMethod) {
  const axis = scale.axis;
  scale.axis = `${axis}MinMin`;
  const min = superMethod(scale, canStack).min;
  scale.axis = `${axis}MaxMax`;
  const max = superMethod(scale, canStack).max;
  scale.axis = axis;
  return { min, max };
}

export function parseErrorBarData(parsed, meta, data, start, count) {
  const iScale = meta.iScale;
  const vScale = meta.vScale;
  const vMin = `${vScale.axis}Min`;
  const vMax = `${vScale.axis}Max`;
  const vMinMin = `${vScale.axis}MinMin`;
  const vMaxMax = `${vScale.axis}MaxMax`;
  const labels = iScale.getLabels();

  const compute = (v, vm, op) => {
    if (Array.isArray(vm)) {
      return op(...vm);
    }
    if (typeof vm === 'number') {
      return vm;
    }
    v;
  };

  for (let i = 0; i < count; i++) {
    const index = i + start;
    const p = parsed[i];
    p[iScale.axis] = iScale.parse(labels[index], index);
    p[vMin] = data[index][vMin];
    p[vMax] = data[index][vMax];
    p[vMinMin] = compute(p[vScale.axis], p[vMin], Math.min);
    p[vMaxMax] = compute(p[vScale.axis], p[vMax], Math.max);
  }

  return parsed;
}
