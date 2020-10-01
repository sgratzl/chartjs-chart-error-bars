import {
  Chart,
  BarController,
  LinearScale,
  CategoryScale,
  Scale,
  IChartMeta,
  Rectangle,
  UpdateMode,
  ScriptableAndArrayOptions,
  IChartConfiguration,
  ChartItem,
  IBarControllerDatasetOptions,
  ICartesianScaleTypeRegistry,
  IBarControllerChartOptions,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
import { styleKeys, IErrorBarOptions } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData, IErrorBarXDataPoint } from './base';
import patchController from './patchController';

export class BarWithErrorBarsController extends BarController {
  getMinMax(scale: Scale, canStack: boolean) {
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

declare module 'chart.js' {
  export enum ChartTypeEnum {
    barWithErrorBars = 'barWithErrorBars',
  }

  export interface IChartTypeRegistry {
    barWithErrorBars: {
      chartOptions: IBarControllerChartOptions;
      datasetOptions: IBarWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarXDataPoint[];
      scales: keyof ICartesianScaleTypeRegistry;
    };
  }
}

export class BarWithErrorBarsChart<DATA extends unknown[] = IErrorBarXDataPoint[], LABEL = string> extends Chart<
  'barWithErrorBars',
  DATA,
  LABEL
> {
  static id = BarWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<IChartConfiguration<'barWithErrorBars', DATA, LABEL>, 'type'>) {
    super(
      item,
      patchController('barWithErrorBars', config, BarWithErrorBarsController, RectangleWithErrorBar, [
        LinearScale,
        CategoryScale,
      ])
    );
  }
}
