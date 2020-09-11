import { modelKeys } from './utils';
import { Tooltip, PolarAreaController, ITooltipItem, TooltipModel } from 'chart.js';
import { IErrorBarRDataPoint, IErrorBarXYDataPoint } from './base';

function reverseOrder<T>(v: T | T[]) {
  return Array.isArray(v) ? v.slice().reverse() : v;
}

export function generateBarTooltip(this: TooltipModel, item: ITooltipItem) {
  const keys = modelKeys((item.element as any).horizontal);
  const base = (Tooltip as any).defaults.callbacks.label.call(this, item);
  const v = (item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as unknown) as IErrorBarXYDataPoint;
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} (${reverseOrder(v[keys[0]])} .. ${v[keys[1]]})`;
}

export function generateTooltipScatter(item: ITooltipItem) {
  const v = (item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as unknown) as IErrorBarXYDataPoint;

  const subLabel = (base: string, horizontal: boolean) => {
    const keys = modelKeys(horizontal);
    if (v == null || keys.every((k) => v[k] == null)) {
      return base;
    }
    return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
  };

  return `(${subLabel(item.label, true)}, ${subLabel(item.dataPoint.y, false)})`;
}

export function generateTooltipPolar(this: TooltipModel, item: ITooltipItem) {
  const base = PolarAreaController.defaults.tooltips.callbacks.label.call(this, item);
  const v = (item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as unknown) as IErrorBarRDataPoint;

  const keys = ['rMin', 'rMax'] as const;
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
}
