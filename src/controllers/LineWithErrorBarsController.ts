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
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { calculateScale } from './utils';
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
} from './base';
import patchController from './patchController';

export class LineWithErrorBarsController extends LineController {
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
      defaultDataPoint: IErrorBarXDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: Record<string, never>;
      parsedDataType: IErrorBarXDataPoint & ChartTypeRegistry['line']['parsedDataType'];
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
