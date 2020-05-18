import { modelKeys } from './utils';
import { defaults } from '../chart';

function reverseOrder(v) {
  return Array.isArray(v) ? v.slice().reverse() : v;
}

function generateTooltip(horizontal) {
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

export const verticalTooltipDefaults = {
  tooltips: {
    callbacks: {
      label: generateTooltip(false),
    },
  },
};

export const horizontalTooltipDefaults = {
  tooltips: {
    callbacks: {
      label: generateTooltip(true),
    },
  },
};

export function generateTooltipScatter(item, data) {
  const v = data.datasets[item.datasetIndex].data[item.index];

  const subLabel = (base, horizontal) => {
    const keys = modelKeys(horizontal);
    if (v == null || keys.every((k) => v[k] == null)) {
      return base;
    }
    return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
  };

  return `(${subLabel(item.label, true)}, ${subLabel(item.value, false)})`;
}

export function generateTooltipPolar(item, data) {
  const base = defaults.polarArea.tooltips.callbacks.label.call(this, item, data);
  const v = data.datasets[item.datasetIndex].data[item.index];

  const keys = ['rMin', 'rMax'];
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
}
