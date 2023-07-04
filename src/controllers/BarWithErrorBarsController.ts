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
  BarControllerChartOptions,
  CartesianScaleTypeRegistry,
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
  IErrorBarYDataPoint,
} from './base';
import patchController from './patchController';

export class BarWithErrorBarsController extends BarController {
  /**
   * @internal
   */
  getMinMax(scale: Scale, canStack: boolean): { min: number; max: number } {
    return getMinMax(scale, (patchedScale) => super.getMinMax(patchedScale, canStack));
  }

  /**
   * @internal
   */
  protected parsePrimitiveData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    const parsed = super.parsePrimitiveData(meta, data, start, count);
    this.parseErrorData(parsed, meta, data, start, count);
    return parsed;
  }

  /**
   * @internal
   */
  protected parseObjectData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    const parsed = super.parseObjectData(meta, data, start, count);
    this.parseErrorData(parsed, meta, data, start, count);
    return parsed;
  }

  private parseErrorData(
    parsed: Record<string, unknown>[],
    meta: ChartMeta,
    data: any[],
    start: number,
    count: number
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parseErrorNumberData(parsed, meta.vScale!, data, start, count);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parseErrorLabelData(parsed, meta.iScale!, start, count);
  }

  /**
   * @internal
   */
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

  /**
   * @internal
   */
  static readonly id = 'barWithErrorBars';

  /**
   * @internal
   */
  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    BarController.defaults,
    animationHints,
    {
      dataElementType: BarWithErrorBar.id,
    },
  ]);

  /**
   * @internal
   */
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

  /**
   * @internal
   */
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
      defaultDataPoint: IErrorBarXDataPoint | IErrorBarYDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: Record<string, never>;
      parsedDataType: (IErrorBarXDataPoint | IErrorBarYDataPoint) & ChartTypeRegistry['bar']['parsedDataType'];
    };
  }
}

export class BarWithErrorBarsChart<DATA extends unknown[] = IErrorBarXDataPoint[], LABEL = string> extends Chart<
  'barWithErrorBars',
  DATA,
  LABEL
> {
  /**
   * @internal
   */
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
