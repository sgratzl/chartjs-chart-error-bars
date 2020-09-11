import {
  Chart,
  LineController,
  LinearScale,
  CategoryScale,
  ChartItem,
  Point,
  Scale,
  IChartConfiguration,
  IChartDataset,
  IChartMeta,
  ILineControllerDatasetOptions,
  IScaleOptions,
  ScriptableAndArrayOptions,
  UpdateMode,
} from 'chart.js';
import { merge } from '../../chartjs-helpers/core';
import { calculateScale } from './utils';
import { IErrorBarOptions, styleObjectKeys } from '../elements/render';
import { PointWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData, IErrorBarXDataPoint } from './base';
import patchController from './patchController';

export class LineWithErrorBarsController extends LineController {
  getMinMax(scale: Scale<IScaleOptions>, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta: IChartMeta, data: any[], start: number, count: number) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale!, data, start, count);
    parseErrorLabelData(parsed, meta.iScale!, start, count);
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
        this._cachedMeta.vScale as LinearScale,
        mode === 'reset'
      );
    }
    super.updateElement(element, index, properties, mode);
  }

  static readonly id = 'lineWithErrorBars';
  static readonly defaults: any = /*#__PURE__*/ merge({}, [
    LineController.defaults,
    animationHints,
    {
      tooltips: {
        callbacks: {
          label: generateBarTooltip,
        },
      },
      dataElementType: PointWithErrorBar.id,
      dataElementOptions: Object.assign({}, LineController.defaults.dataElementOptions, styleObjectKeys),
    },
  ]);
  static readonly defaultRoutes = LineController.defaultRoutes;
}

export interface ILineWithErrorBarsControllerDatasetOptions
  extends ILineControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions> {}

export type ILineWithErrorBarsControllerDataset<T = IErrorBarXDataPoint> = IChartDataset<
  T,
  ILineWithErrorBarsControllerDatasetOptions
>;

export type ILineWithErrorBarsControllerConfiguration<T = IErrorBarXDataPoint, L = string> = IChartConfiguration<
  'lineWithErrorBars',
  T,
  L,
  ILineWithErrorBarsControllerDataset<T>
>;

export class LineWithErrorBarsChart<T = IErrorBarXDataPoint, L = string> extends Chart<
  T,
  L,
  ILineWithErrorBarsControllerConfiguration<T, L>
> {
  static id = LineWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<ILineWithErrorBarsControllerConfiguration<T, L>, 'type'>) {
    super(
      item,
      patchController('lineWithErrorBars', config, LineWithErrorBarsController, PointWithErrorBar, [
        LinearScale,
        CategoryScale,
      ])
    );
  }
}
