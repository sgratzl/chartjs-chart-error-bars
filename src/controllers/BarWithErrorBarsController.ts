import {
  Chart,
  BarController,
  LinearScale,
  CategoryScale,
  Scale,
  IScaleOptions,
  IChartMeta,
  Rectangle,
  UpdateMode,
  ScriptableAndArrayOptions,
  IChartConfiguration,
  IChartDataset,
  ChartItem,
  IBarControllerDatasetOptions,
} from 'chart.js';
import { merge } from '../../chartjs-helpers/core';
import { calculateScale } from './utils';
import { styleKeys, IErrorBarOptions } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData, IErrorBarXDataPoint } from './base';
import patchController from './patchController';

export class BarWithErrorBarsController extends BarController {
  getMinMax(scale: Scale<IScaleOptions>, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta: IChartMeta, data: any[], start: number, count: number) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale!, data, start, count);
    parseErrorLabelData(parsed, meta.iScale!, start, count);
    return parsed;
  }

  updateElement(element: Rectangle, index: number | undefined, properties: any, mode: UpdateMode) {
    // inject the other error bar related properties
    if (typeof index === 'number') {
      calculateScale(
        properties,
        this.getParsed(index),
        index,
        this._cachedMeta.vScale as LinearScale,
        mode === 'reset'
      );
    }
    super.updateElement(element, index, properties, mode);
  }

  static readonly id = 'barWithErrorBars';
  static readonly defaults: any = /*#__PURE__*/ merge({}, [
    BarController.defaults,
    animationHints,
    {
      tooltips: {
        callbacks: {
          label: generateBarTooltip,
        },
      },
      dataElementOptions: BarController.defaults.dataElementOptions.concat(styleKeys),
      dataElementType: RectangleWithErrorBar.id,
    },
  ]);
  static readonly defaultRoutes = BarController.defaultRoutes;
}

export interface IBarWithErrorBarsControllerDatasetOptions
  extends IBarControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions> {}

export type IBarWithErrorBarsControllerDataset<T = IErrorBarXDataPoint> = IChartDataset<
  T,
  IBarWithErrorBarsControllerDatasetOptions
>;

export type IBarWithErrorBarsControllerConfiguration<T = IErrorBarXDataPoint, L = string> = IChartConfiguration<
  'barWithErrorBars',
  T,
  L,
  IBarWithErrorBarsControllerDataset<T>
>;

export class BarWithErrorBarsChart<T = IErrorBarXDataPoint, L = string> extends Chart<
  T,
  L,
  IBarWithErrorBarsControllerConfiguration<T, L>
> {
  static id = BarWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<IBarWithErrorBarsControllerConfiguration<T, L>, 'type'>) {
    super(
      item,
      patchController('barWithErrorBars', config, BarWithErrorBarsController, RectangleWithErrorBar, [
        LinearScale,
        CategoryScale,
      ])
    );
  }
}
