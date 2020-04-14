import { modelKeys } from '../data';
import * as Chart from 'chart.js';

function calculateScale(model, data, scale, horizontal, reset) {
  const keys = modelKeys(horizontal);
  const base = scale.getBasePixel();

  keys.forEach((key) => {
    const v = data[key];
    if (Array.isArray(v)) {
      model[key] = v.map((d) => (reset ? base : scale.getPixelForValue(d)));
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

function reverseOrder(v) {
  return Array.isArray(v) ? v.slice().reverse() : v;
}

export function generateTooltip(horizontal) {
  const keys = modelKeys(horizontal);
  return (item, data) => {
    const base = Chart.defaults.global.tooltips.callbacks.label.call(this, item, data);
    const v = data.datasets[item.datasetIndex].data[item.index];
    if (v == null || keys.every((k) => v[k] == null)) {
      return base;
    }
    return `${base} (${reverseOrder(v[keys[0]])} .. ${v[keys[1]]})`;
  };
}

export function generateTooltipScatter(item, data) {
  const v = data.datasets[item.datasetIndex].data[item.index];

  const subLabel = (base, horizontal) => {
    const keys = modelKeys(horizontal);
    if (v == null || keys.every((k) => v[k] == null)) {
      return base;
    }
    return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
  };

  return `(${subLabel(item.xLabel, true)}, ${subLabel(item.yLabel, false)})`;
}

export function generateTooltipPolar(item, data) {
  const base = Chart.defaults.polarArea.tooltips.callbacks.label.call(this, item, data);
  const v = data.datasets[item.datasetIndex].data[item.index];

  const keys = modelKeys(false);
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
}
