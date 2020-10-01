import {
  Chart,
  LineController,
  LinearScale,
  CategoryScale,
  ChartItem,
  Point,
  Scale,
  IChartConfiguration,
  IChartMeta,
  ILineControllerDatasetOptions,
  ScriptableAndArrayOptions,
  UpdateMode,
  ICartesianScaleTypeRegistry,
  ILineControllerChartOptions,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
import { IErrorBarOptions, styleObjectKeys } from '../elements/render';
import { PointWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData, IErrorBarXDataPoint } from './base';
import patchController from './patchController';

export class LineWithErrorBarsController extends LineController {
  getMinMax(scale: Scale, canStack: boolean) {
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

declare module 'chart.js' {
  export enum ChartTypeEnum {
    lineWithErrorBars = 'lineWithErrorBars',
  }

  export interface IChartTypeRegistry {
    lineWithErrorBars: {
      chartOptions: ILineControllerChartOptions;
      datasetOptions: ILineWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarXDataPoint[];
      scales: keyof ICartesianScaleTypeRegistry;
    };
  }
}

export class LineWithErrorBarsChart<DATA extends unknown[] = IErrorBarXDataPoint[], LABEL = string> extends Chart<
  'lineWithErrorBars',
  DATA,
  LABEL
> {
  static id = LineWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<IChartConfiguration<'lineWithErrorBars', DATA, LABEL>, 'type'>) {
    super(
      item,
      patchController('lineWithErrorBars', config, LineWithErrorBarsController, PointWithErrorBar, [
        LinearScale,
        CategoryScale,
      ])
    );
  }
}
