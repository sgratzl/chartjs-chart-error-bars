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
  IControllerDatasetOptions,
  ScriptableAndArrayOptions,
  ICommonHoverOptions,
  IChartConfiguration,
  IChartDataset,
  ChartItem,
} from 'chart.js';
import { merge } from '../../chartjs-helpers/core';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';
import patchController from './patchController';

export class BarWithErrorBarsController extends BarController {
  getMinMax(scale: Scale<IScaleOptions>, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta: IChartMeta, data: any[], start: number, count: number) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale, data, start, count);
    parseErrorLabelData(parsed, meta.iScale, start, count);
    return parsed;
  }

  updateElement(element: Rectangle, index: number | undefined, properties: any, mode: UpdateMode) {
    // inject the other error bar related properties
    calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale as LinearScale, mode === 'reset');
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
}

export interface IBarWithErrorBarsControllerDatasetOptions
  extends IControllerDatasetOptions,
    IBarWithErrorBarsOptions,
    ScriptableAndArrayOptions<IBoxAndWhiskersOptions>,
    ScriptableAndArrayOptions<ICommonHoverOptions> {}

export interface IBarWithErrorBarsDataPoint {
  x?: number;
  xMin?: number | number[];
  xMax?: number | number[];

  y?: number;
  yMin?: number | number[];
  yMax?: number | number[];
}

export type IBarWithErrorBarsControllerDataset<T = IBarWithErrorBarsDataPoint> = IChartDataset<
  T,
  IBarWithErrorBarsControllerDatasetOptions
>;

export interface IBarWithErrorBarsChartOptions {}

export type IBarWithErrorBarsControllerConfiguration<T = IBarWithErrorBarsDataPoint, L = string> = IChartConfiguration<
  'barWithErrorBars',
  T,
  L,
  IBarWithErrorBarsControllerDataset<T>,
  IBarWithErrorBarsChartOptions
>;

export class BarWithErrorBarsChart<T = IBarWithErrorBarsDataPoint, L = string> extends Chart<
  T,
  L,
  IBarWithErrorBarsControllerConfiguration<T, L>
> {
  static id = BarWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<IBarWithErrorBarsControllerConfiguration<T, L>, 'type'>) {
    super(item, patchController('barWithErrorBars', config, BarWithErrorBarsController, BoxAndWiskers, []));
  }
}
