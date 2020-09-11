import {
  Chart,
  ScatterController,
  LinearScale,
  ChartItem,
  IChartConfiguration,
  IChartDataset,
  IChartMeta,
  IScaleOptions,
  IScatterControllerDatasetOptions,
  Point,
  Scale,
  ScriptableAndArrayOptions,
  UpdateMode,
  LineController,
} from 'chart.js';
import { merge } from '../../chartjs-helpers/core';
import { calculateScale } from './utils';
import { getMinMax, IErrorBarXYDataPoint, parseErrorNumberData } from './base';
import { generateTooltipScatter } from './tooltip';
import { animationHints } from '../animate';
import { PointWithErrorBar } from '../elements';
import { IErrorBarOptions, styleObjectKeys } from '../elements/render';
import patchController from './patchController';

export class ScatterWithErrorBarsController extends ScatterController {
  getMinMax(scale: Scale<IScaleOptions>, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta: IChartMeta, data: any[], start: number, count: number) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.xScale!, data, start, count);
    parseErrorNumberData(parsed, meta.yScale!, data, start, count);
    return parsed;
  }

  updateElement(element: Point, index: number | undefined, properties: any, mode: UpdateMode) {
    // inject the other error bar related properties
    if (element instanceof PointWithErrorBar && typeof index === 'number') {
      // inject the other error bar related properties
      calculateScale(
        properties,
        this.getParsed(index),
        index,
        this._cachedMeta.xScale as LinearScale,
        mode === 'reset'
      );
      calculateScale(
        properties,
        this.getParsed(index),
        index,
        this._cachedMeta.yScale as LinearScale,
        mode === 'reset'
      );
    }
    super.updateElement(element, index, properties, mode);
  }

  static readonly id = 'scatterWithErrorBars';
  static readonly defaults: any = /*#__PURE__*/ merge({}, [
    ScatterController.defaults,
    animationHints,
    {
      tooltips: {
        callbacks: {
          label: generateTooltipScatter,
        },
      },
      dataElementType: PointWithErrorBar.id,
      dataElementOptions: Object.assign({}, LineController.defaults.dataElementOptions, styleObjectKeys),
    },
  ]);
  static readonly defaultRoutes = LineController.defaultRoutes;
}

export interface IScatterWithErrorBarsControllerDatasetOptions
  extends IScatterControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions> {}

export type IScatterWithErrorBarsControllerDataset<T = IErrorBarXYDataPoint> = IChartDataset<
  T,
  IScatterWithErrorBarsControllerDatasetOptions
>;

export type IScatterWithErrorBarsControllerConfiguration<T = IErrorBarXYDataPoint, L = string> = IChartConfiguration<
  'scatterWithErrorBars',
  T,
  L,
  IScatterWithErrorBarsControllerDataset<T>
>;

export class ScatterWithErrorBarsChart<T = IErrorBarXYDataPoint, L = string> extends Chart<
  T,
  L,
  IScatterWithErrorBarsControllerConfiguration<T, L>
> {
  static id = ScatterWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<IScatterWithErrorBarsControllerConfiguration<T, L>, 'type'>) {
    super(
      item,
      patchController('scatterWithErrorBars', config, ScatterWithErrorBarsController, PointWithErrorBar, [LinearScale])
    );
  }
}
