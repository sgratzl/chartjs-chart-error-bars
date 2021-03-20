import {
  Chart,
  PolarAreaController,
  RadialLinearScale,
  Scale,
  UpdateMode,
  Element,
  ChartMeta,
  ChartItem,
  ChartConfiguration,
  PolarAreaControllerDatasetOptions,
  ScriptableAndArrayOptions,
  PolarAreaControllerChartOptions,
  CartesianScaleTypeRegistry,
  ScriptableContext,
} from 'chart.js';
import { merge, resolve } from 'chart.js/helpers';
import { calculatePolarScale } from './utils';
import { getMinMax, IErrorBarRDataPoint, parseErrorNumberData } from './base';
import { generateTooltipPolar } from './tooltip';
import { animationHints } from '../animate';
import { ArcWithErrorBar } from '../elements';
import { IErrorBarOptions } from '../elements/render';
import patchController from './patchController';

export class PolarAreaWithErrorBarsController extends PolarAreaController {
  getMinMax(scale: Scale, canStack: boolean) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  countVisibleElements() {
    const meta = this._cachedMeta;
    return meta.data.reduce((acc, _, index) => {
      // use different data lookup
      if (!Number.isNaN((meta._parsed[index] as { r: number }).r) && this.chart.getDataVisibility(index)) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  _computeAngle(index: number) {
    const meta = this._cachedMeta;
    const count = (meta as any).count as number;
    // use different data lookup
    if (Number.isNaN((meta._parsed[index] as { r: number }).r) || !this.chart.getDataVisibility(index)) {
      return 0;
    }
    const context = (this as any).getContext(index, true);
    return resolve([(this.chart.options as any).elements.arc.angle, (2 * Math.PI) / count], context, index);
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number) {
    const parsed = new Array(count);
    const scale = meta.rScale!;
    for (let i = 0; i < count; ++i) {
      const index = i + start;
      const item = data[index];
      const v = scale.parse(item[scale.axis], index);
      parsed[i] = {
        [scale.axis]: v,
      };
    }
    parseErrorNumberData(parsed, meta.rScale!, data, start, count);
    return parsed;
  }

  updateElement(element: Element, index: number | undefined, properties: any, mode: UpdateMode) {
    if (typeof index === 'number') {
      calculatePolarScale(
        properties,
        this.getParsed(index) as IErrorBarRDataPoint,
        this._cachedMeta.rScale as RadialLinearScale,
        mode === 'reset',
        this.chart.options
      );
    }
    super.updateElement(element, index, properties, mode);
  }

  updateElements(arcs: Element[], start: number, count: number, mode: UpdateMode) {
    const scale = this.chart.scales.r as RadialLinearScale;
    const bak = scale.getDistanceFromCenterForValue;
    scale.getDistanceFromCenterForValue = function (v) {
      if (typeof v === 'number') {
        return bak.call(this, v);
      }
      return bak.call(this, (v as any).r);
    };
    super.updateElements(arcs, start, count, mode);
    scale.getDistanceFromCenterForValue = bak;
  }

  static readonly id = 'polarAreaWithErrorBars';

  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    PolarAreaController.defaults,
    animationHints,
    {
      dataElementType: ArcWithErrorBar.id,
    },
  ]);

  static readonly overrides: any = /* #__PURE__ */ merge({}, [
    (PolarAreaController as any).overrides,
    {
      plugins: {
        tooltip: {
          callbacks: {
            label: generateTooltipPolar,
          },
        },
      },
    },
  ]);

  static readonly defaultRoutes = PolarAreaController.defaultRoutes;
}

export interface PolarAreaWithErrorBarsControllerDatasetOptions
  extends PolarAreaControllerDatasetOptions,
    ScriptableAndArrayOptions<IErrorBarOptions, ScriptableContext<'polarAreaWithErrorBars'>> {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    polarAreaWithErrorBars: {
      chartOptions: PolarAreaControllerChartOptions;
      datasetOptions: PolarAreaWithErrorBarsControllerDatasetOptions;
      defaultDataPoint: IErrorBarRDataPoint[];
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class PolarAreaWithErrorBarsChart<DATA extends unknown[] = IErrorBarRDataPoint[], LABEL = string> extends Chart<
  'polarAreaWithErrorBars',
  DATA,
  LABEL
> {
  static id = PolarAreaWithErrorBarsController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'polarAreaWithErrorBars', DATA, LABEL>, 'type'>) {
    super(
      item,
      patchController('polarAreaWithErrorBars', config, PolarAreaWithErrorBarsController, ArcWithErrorBar, [
        RadialLinearScale,
      ])
    );
  }
}
