import {modelKeys} from '../data';


function calculateScale(model, data, scale, horizontal, reset) {
  const keys = modelKeys(horizontal);
  const base = scale.getBasePixel();

  keys.forEach((key) => {
    const v = data[key];
    if (Array.isArray(v)) {
      model[key] = v.map((d) => reset ? base : scale.getPixelForValue(d));
    } else if (typeof v === 'number') {
      model[key] = reset ? base : scale.getPixelForValue(v);
    }
  });
}

export function calculateErrorBarValuesPixels(controller, model, index, reset) {
  const data = controller.getDataset().data[index];
  if (!data) {
    return;
  }

  const scale = controller._getValueScale();
  calculateScale(model, data, scale, scale.isHorizontal(), reset);
}

export function calculateErrorBarValuesPixelsScatter(controller, model, index, reset) {
  const data = controller.getDataset().data[index];
  if (!data) {
    return;
  }

  const meta = controller.getMeta();
  calculateScale(model, data, controller.getScaleForId(meta.xAxisID), true, reset);
  calculateScale(model, data, controller.getScaleForId(meta.yAxisID), false, reset);
}

export function calculateErrorBarValuesPixelsPolar(controller, arc, model, index, reset) {
  const data = controller.getDataset().data[index];
  if (!data) {
    return;
  }

  const chart = controller.chart;
  const scale = chart.scale;
  const animationOpts = chart.options.animation;

  const valueRadius = scale.getDistanceFromCenterForValue(data);
  const resetRadius = animationOpts.animateScale ? 0 : valueRadius;
  const outerRadius = reset ? resetRadius : (arc.hidden ? 0 : valueRadius);

  // calculateScale(model, data, controller.getScaleForId(meta.xAxisID), true, reset);
  // calculateScale(model, data, controller.getScaleForId(meta.yAxisID), false, reset);
}
