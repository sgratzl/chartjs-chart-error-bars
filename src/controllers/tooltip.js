import { modelKeys } from './utils';
import { defaults } from 'chart.js';

function reverseOrder(v) {
  return Array.isArray(v) ? v.slice().reverse() : v;
}

export function generateTooltip(horizontal) {
  const keys = modelKeys(horizontal);
  return (item, data) => {
    const base = defaults.tooltips.callbacks.label.call(this, item, data);
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
  const base = defaults.polarArea.tooltips.callbacks.label.call(this, item, data);
  const v = data.datasets[item.datasetIndex].data[item.index];

  const keys = modelKeys(false);
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
}
