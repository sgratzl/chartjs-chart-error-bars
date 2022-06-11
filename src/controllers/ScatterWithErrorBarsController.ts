import {
  Chart,
  ScatterController,
  LinearScale,
  ChartItem,
  ChartConfiguration,
  ChartMeta,
  ScatterControllerDatasetOptions,
  Scale,
  ScriptableAndArrayOptions,
  UpdateMode,
  LineController,
  ScriptableContext,
  Element,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
import { getMinMax, IErrorBarXYDataPoint, parseErrorNumberData } from './base';
import { generateTooltipScatter } from './tooltip';
import { animationHints } from '../animate';
import { PointWithErrorBar } from '../elements';
import type { IErrorBarOptions } from '../elements/render';
import patchController from './patchController';

export class ScatterWithErrorBarsController extends ScatterController {
  getMinMax(scale: Scale, canStack: boolean): { min: number; max: number } {
    return getMinMax(scale, (patchedScale) => super.getMinMax(patchedScale, canStack));
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    const parsed = super.parseObjectData(meta, data, start, count);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parseErrorNumberData(parsed, meta.xScale!, data, start, count);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    parseErrorNumberData(parsed, meta.yScale!, data, start, count);
    return parsed;
  }

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

  protected updateElementScale(index: number, properties: Record<string, unknown>, mode: UpdateMode): void {
    // inject the other error bar related properties
    calculateScale(
      properties,
      this.getParsed(index) as Partial<IErrorBarXYDataPoint>,
      index,
      this._cachedMeta.xScale as LinearScale,
      mode === 'reset'
    );
    calculateScale(
      properties,
      this.getParsed(index) as Partial<IErrorBarXYDataPoint>,
      index,
      this._cachedMeta.yScale as LinearScale,
      mode === 'reset'
    );
  }

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

  static readonly id = 'scatterWithErrorBars';

  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    ScatterController.defaults,
    animationHints,
    {
      dataElementType: PointWithErrorBar.id,
    },
  ]);

  static readonly overrides: any = /* #__PURE__ */ merge({}, [
    (ScatterController as any).overrides,
    {
      plugins: {
        tooltip: {
          callbacks: {
            label: generateTooltipScatter,
          },
        },
      },
    },
  ]);

  static readonly defaultRoutes = LineController.defaultRoutes;
}

export interface ScatterWithErrorBarsControllerDatasetOptions
  extends ScatterControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions, ScriptableContext<'scatterWithErrorBars'>> {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    scatterWithErrorBars: {
      chartOptions: ScatterControllerChartOptions;
      datasetOptions: ScatterWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarXYDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: Record<string, never>;
      parsedDataType: IErrorBarXYDataPoint & ChartTypeRegistry['scatter']['parsedDataType'];
    };
  }
}

export class ScatterWithErrorBarsChart<DATA extends unknown[] = IErrorBarXYDataPoint[], LABEL = string> extends Chart<
  'scatterWithErrorBars',
  DATA,
  LABEL
> {
  static id = ScatterWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'scatterWithErrorBars', DATA, LABEL>, 'type'>) {
    super(
      item,
      patchController('scatterWithErrorBars', config, ScatterWithErrorBarsController, PointWithErrorBar, [LinearScale])
    );
  }
}
