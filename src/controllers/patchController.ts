import { IChartComponentLike, registry, IDatasetControllerChartComponent } from 'chart.js';

export default function patchController<T, TYPE>(
  type: TYPE,
  config: T,
  controller: IDatasetControllerChartComponent,
  elements: IChartComponentLike = [],
  scales: IChartComponentLike = []
): T & { type: TYPE } {
  registry.addControllers(controller);
  registry.addElements(elements);
  registry.addScales(scales);
  const c = config as any;
  c.type = type;
  return c;
}
