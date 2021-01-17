import {
  Chart,
  BarController,
  LinearScale,
  CategoryScale,
  Scale,
  ChartMeta,
  BarElement,
  UpdateMode,
  ScriptableAndArrayOptions,
  ScriptableContext,
  ChartConfiguration,
  ChartItem,
  BarControllerDatasetOptions,
  CartesianScaleTypeRegistry,
  BarControllerChartOptions,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
import { styleKeys, IErrorBarOptions } from '../elements/render';
import { BarWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData, IErrorBarXDataPoint } from './base';
import patchController from './patchController';

export class BarWithErrorBarsController extends BarController {
  getMinMax(scale: Scale, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale!, data, start, count);
    parseErrorLabelData(parsed, meta.iScale!, start, count);
    return parsed;
  }

  updateElement(element: BarElement, index: number | undefined, properties: any, mode: UpdateMode) {
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
      plugins: {
        tooltip: {
          callbacks: {
            label: generateBarTooltip,
          },
        },
      },
      dataElementOptions: BarController.defaults.dataElementOptions.concat(styleKeys),
      dataElementType: BarWithErrorBar.id,
    },
  ]);
  static readonly defaultRoutes = BarController.defaultRoutes;
}

export interface BarWithErrorBarsControllerDatasetOptions
  extends BarControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions, ScriptableContext> {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    barWithErrorBars: {
      chartOptions: BarControllerChartOptions;
      datasetOptions: BarWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarXDataPoint[];
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class BarWithErrorBarsChart<DATA extends unknown[] = IErrorBarXDataPoint[], LABEL = string> extends Chart<
  'barWithErrorBars',
  DATA,
  LABEL
> {
  static id = BarWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'barWithErrorBars', DATA, LABEL>, 'type'>) {
    super(
      item,
      patchController('barWithErrorBars', config, BarWithErrorBarsController, BarWithErrorBar, [
        LinearScale,
        CategoryScale,
      ])
    );
  }
}
