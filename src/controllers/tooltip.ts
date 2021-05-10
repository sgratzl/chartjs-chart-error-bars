import { Tooltip, PolarAreaController, TooltipItem, TooltipModel } from 'chart.js';
import { modelKeys } from './utils';
import type { IErrorBarRDataPoint, IErrorBarXYDataPoint } from './base';

function reverseOrder<T>(v: T | T[]) {
  return Array.isArray(v) ? v.slice().reverse() : v;
}

export function generateBarTooltip(this: TooltipModel<'bar'>, item: TooltipItem<'bar'>): string {
  const keys = modelKeys((item.element as any).horizontal);
  const base = (Tooltip as any).defaults.callbacks.label.call(this, item);
  const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as unknown as IErrorBarXYDataPoint;
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} (${reverseOrder(v[keys[0]])} .. ${v[keys[1]]})`;
}

export function generateTooltipScatter(item: TooltipItem<'scatter'>): string {
  const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as unknown as IErrorBarXYDataPoint;

  const subLabel = (base: string | number | boolean, horizontal: boolean) => {
    const keys = modelKeys(horizontal);
    if (v == null || keys.every((k) => v[k] == null)) {
      return base;
    }
    return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
  };

  return `(${subLabel(item.label, true)}, ${subLabel(item.parsed.y, false)})`;
}

export function generateTooltipPolar(this: TooltipModel<'polarArea'>, item: TooltipItem<'polarArea'>): string {
  const base = (PolarAreaController as any).overrides.plugins.tooltip.callbacks.label.call(this, item);
  const v = item.chart.data.datasets[item.datasetIndex].data[item.dataIndex] as unknown as IErrorBarRDataPoint;

  const keys = ['rMin', 'rMax'] as const;
  if (v == null || keys.every((k) => v[k] == null)) {
    return base;
  }
  return `${base} [${reverseOrder(v[keys[0]])} .. ${v[keys[1]]}]`;
}
