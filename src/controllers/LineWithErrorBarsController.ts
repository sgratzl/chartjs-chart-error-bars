import {
  Chart,
  LineController,
  LinearScale,
  CategoryScale,
  ChartItem,
  Scale,
  ChartConfiguration,
  ChartMeta,
  LineControllerDatasetOptions,
  ScriptableAndArrayOptions,
  UpdateMode,
  ScriptableContext,
  Element,
  LineControllerChartOptions,
  CartesianScaleTypeRegistry,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale, isNumericScale } from './utils';
import type { IErrorBarOptions } from '../elements/render';
import { PointWithErrorBar } from '../elements';
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

export class LineWithErrorBarsController extends LineController {
  /**
   * @hidden
   */
  getMinMax(scale: Scale, canStack: boolean): { min: number; max: number } {
    return getMinMax(scale, (patchedScale) => super.getMinMax(patchedScale, canStack));
  }

  /**
   * @hidden
   */
  protected parsePrimitiveData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    const parsed = super.parsePrimitiveData(meta, data, start, count);
    this.parseErrorData(parsed, meta, data, start, count);
    return parsed;
  }

  /**
   * @hidden
   */
  protected parseObjectData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    const parsed = super.parseObjectData(meta, data, start, count);
    this.parseErrorData(parsed, meta, data, start, count);
    return parsed;
  }

  /**
   * @hidden
   */
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
    const iScale = meta.iScale as Scale;
    const hasNumberIScale = isNumericScale(iScale);
    if (hasNumberIScale) {
      parseErrorNumberData(parsed, meta.iScale!, data, start, count);
    } else {
      parseErrorLabelData(parsed, meta.iScale!, start, count);
    }
  }

  /**
   * @hidden
   */
  updateElement(
    element: Element,
    index: number | undefined,
    properties: Record<string, unknown>,
    mode: UpdateMode
  ): void {
    // inject the other error bar related properties
    if (element instanceof PointWithErrorBar && typeof index === 'number') {
      this.updateElementScale(index, properties, mode);
    }
    super.updateElement(element, index, properties, mode);
  }

  /**
   * @hidden
   */
  protected updateElementScale(index: number, properties: Record<string, unknown>, mode: UpdateMode): void {
    // inject the other error bar related properties
    calculateScale(
      properties,
      this.getParsed(index) as Partial<IErrorBarXYDataPoint>,
      index,
      this._cachedMeta.vScale as LinearScale,
      mode === 'reset'
    );

    const iScale = this._cachedMeta.iScale as Scale;
    const hasNumberIScale = isNumericScale(iScale);
    if (hasNumberIScale) {
      calculateScale(
        properties,
        this.getParsed(index) as Partial<IErrorBarXYDataPoint>,
        index,
        this._cachedMeta.iScale as LinearScale,
        mode === 'reset'
      );
    }
  }

  /**
   * @hidden
   */
  updateElements(points: Element[], start: number, count: number, mode: UpdateMode) {
    const reset = mode === 'reset';
    const c = this.chart as unknown as { _animationsDisabled: boolean };
    const directUpdate = c._animationsDisabled || reset || mode === 'none';
    // directUpdate not supported hack it
    super.updateElements(points, start, count, mode);

    if (!directUpdate) {
      return;
    }
    // manually update since with optimizations updateElement is not called
    for (let i = start; i < start + count; ++i) {
      const point = points[i];
      // inject the other error bar related properties
      if (point instanceof PointWithErrorBar) {
        this.updateElementScale(i, point as unknown as Record<string, unknown>, mode);
      }
    }
  }

  static readonly id = 'lineWithErrorBars';

  /**
   * @hidden
   */
  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    LineController.defaults,
    animationHints,
    {
      dataElementType: PointWithErrorBar.id,
    },
  ]);

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
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
      defaultDataPoint: IErrorBarXDataPoint | IErrorBarYDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: Record<string, never>;
      parsedDataType: (IErrorBarXDataPoint | IErrorBarYDataPoint) & ChartTypeRegistry['line']['parsedDataType'];
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
