import { modelKeys } from './utils';
import { Tooltip, PolarAreaController } from 'chart.js';

function reverseOrder(v) {
  return Array.isArray(v) ? v.slice().reverse() : v;
}

export function generateBarTooltip(item) {
  const keys = modelKeys(item.element.horizontal);
  const base = Tooltip.defaults.callbacks.label.call(this, item);
  const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex];
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} (${reverseOrder(v[keys[0]])} .. ${v[keys[1]]})`;
}

export function generateTooltipScatter(item) {
  const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex];

  const subLabel = (base, horizontal) => {
    const keys = modelKeys(horizontal);
    if (v == null || keys.every((k) => v[k] == null)) {
      return base;
    }
    return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
  };

  return `(${subLabel(item.label, true)}, ${subLabel(item.value, false)})`;
}

export function generateTooltipPolar(item) {
  const base = PolarAreaController.defaults.tooltips.callbacks.label.call(this, item);
  const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex];

  const keys = ['rMin', 'rMax'];
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
}
