import {
  Chart,
  LineController,
  LinearScale,
  CategoryScale,
  ChartItem,
  PointElement,
  Scale,
  ChartConfiguration,
  ChartMeta,
  LineControllerDatasetOptions,
  ScriptableAndArrayOptions,
  UpdateMode,
  CartesianScaleTypeRegistry,
  LineControllerChartOptions,
  ScriptableContext,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
import { IErrorBarOptions } from '../elements/render';
import { PointWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import {
  getMinMax,
  parseErrorNumberData,
  parseErrorLabelData,
  IErrorBarXDataPoint,
  IErrorBarXYDataPoint,
} from './base';
import patchController from './patchController';

export class LineWithErrorBarsController extends LineController {
  getMinMax(scale: Scale, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale!, data, start, count);
    parseErrorLabelData(parsed, meta.iScale!, start, count);
    return parsed;
  }

  updateElement(element: PointElement, index: number | undefined, properties: any, mode: UpdateMode) {
    // inject the other error bar related properties
    if (element instanceof PointWithErrorBar && typeof index === 'number') {
      // inject the other error bar related properties
      calculateScale(
        properties,
        this.getParsed(index) as Partial<IErrorBarXYDataPoint>,
        index,
        this._cachedMeta.vScale as LinearScale,
        mode === 'reset'
      );
    }
    super.updateElement(element, index, properties, mode);
  }

  static readonly id = 'lineWithErrorBars';

  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    LineController.defaults,
    animationHints,
    {
      dataElementType: PointWithErrorBar.id,
    },
  ]);

  static readonly overrides: any = /* #__PURE__ */ merge({}, [
    (LineController as any).overrides,
    {
      plugins: {
        tooltip: {
          callbacks: {
            label: generateBarTooltip,
          },
        },
      },
    },
  ]);

  static readonly defaultRoutes = LineController.defaultRoutes;
}

export interface LineWithErrorBarsControllerDatasetOptions
  extends LineControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions, ScriptableContext<'lineWithErrorBars'>> {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    lineWithErrorBars: {
      chartOptions: LineControllerChartOptions;
      datasetOptions: LineWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarXDataPoint[];
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class LineWithErrorBarsChart<DATA extends unknown[] = IErrorBarXDataPoint[], LABEL = string> extends Chart<
  'lineWithErrorBars',
  DATA,
  LABEL
> {
  static id = LineWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'lineWithErrorBars', DATA, LABEL>, 'type'>) {
    super(
      item,
      patchController('lineWithErrorBars', config, LineWithErrorBarsController, PointWithErrorBar, [
        LinearScale,
        CategoryScale,
      ])
    );
  }
}
