export const allModelKeys = ['xMin', 'xMax', 'yMin', 'yMax'];

export function modelKeys(horizontal) {
  return horizontal ? allModelKeys.slice(0, 2) : allModelKeys.slice(2);
}

export function calculateScale(properties, data, scale, reset) {
  const keys = modelKeys(scale.isHorizontal());
  const base = scale.getBasePixel();

  keys.forEach((key) => {
    const v = data[key];
    if (Array.isArray(v)) {
      properties[key] = v.map((d) => (reset ? base : scale.getPixelForValue(d)));
    } else if (typeof v === 'number') {
      properties[key] = reset ? base : scale.getPixelForValue(v);
    }
  });
}

export function calculateErrorBarValuesPixelsPolar(controller, arc, model, index, reset) {
  const data = controller.getDataset().data[index];
  if (!data) {
    return;
  }

  const chart = controller.chart;
  const scale = chart.scale;
  const animationOpts = chart.options.animation;

  const toAngle = (v) => {
    const valueRadius = scale.getDistanceFromCenterForValue(v);
    const resetRadius = animationOpts.animateScale ? 0 : valueRadius;
    return reset ? resetRadius : arc.hidden ? 0 : valueRadius;
  };

  modelKeys(false).forEach((key) => {
    // y variant
    const v = data[key];
    if (Array.isArray(v)) {
      model[key] = v.map(toAngle);
    } else if (typeof v === 'number') {
      model[key] = toAngle(v);
    }
  });
}
