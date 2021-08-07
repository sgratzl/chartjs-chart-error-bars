import {
  Chart,
  BarController,
  LinearScale,
  CategoryScale,
  Scale,
  ChartMeta,
  UpdateMode,
  ScriptableAndArrayOptions,
  ScriptableContext,
  ChartConfiguration,
  ChartItem,
  BarControllerDatasetOptions,
  Element,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
import type { IErrorBarOptions } from '../elements/render';
import { BarWithErrorBar } from '../elements';
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

export class BarWithErrorBarsController extends BarController {
  getMinMax(scale: Scale, canStack: boolean): { min: number; max: number } {
    return getMinMax(scale, (patchedScale) => super.getMinMax(patchedScale, canStack));
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    const parsed = super.parseObjectData(meta, data, start, count);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parseErrorNumberData(parsed, meta.vScale!, data, start, count);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parseErrorLabelData(parsed, meta.iScale!, start, count);
    return parsed;
  }

  updateElement(
    element: Element,
    index: number | undefined,
    properties: Record<string, unknown>,
    mode: UpdateMode
  ): void {
    // inject the other error bar related properties
    if (typeof index === 'number') {
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

  static readonly id = 'barWithErrorBars';

  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    BarController.defaults,
    animationHints,
    {
      dataElementType: BarWithErrorBar.id,
    },
  ]);

  static readonly overrides: any = /* #__PURE__ */ merge({}, [
    (BarController as any).overrides,
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

  static readonly defaultRoutes = BarController.defaultRoutes;
}

export interface BarWithErrorBarsControllerDatasetOptions
  extends BarControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions, ScriptableContext<'barWithErrorBars'>> {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    barWithErrorBars: {
      chartOptions: BarControllerChartOptions;
      datasetOptions: BarWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarXDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: Record<string, never>;
      parsedDataType: IErrorBarXDataPoint & ChartTypeRegistry['bar']['parsedDataType'];
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
