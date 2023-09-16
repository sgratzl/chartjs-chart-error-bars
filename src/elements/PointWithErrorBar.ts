import {
  PointElement,
  PointOptions,
  PointHoverOptions,
  ChartType,
  ScriptableAndArrayOptions,
  ScriptableContext,
} from 'chart.js';
import { renderErrorBar, errorBarDefaults, errorBarDescriptors, IErrorBarOptions } from './render';

export default class PointWithErrorBar extends PointElement {
  /**
   * @hidden
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  draw(ctx: CanvasRenderingContext2D, area?: any): void {
    (super.draw.call as any)(this, ctx, area);

    renderErrorBar(this as any, ctx);
  }

  static readonly id = 'pointWithErrorBar';

  /**
   * @hidden
   */
  static readonly defaults: any = /* #__PURE__ */ { ...PointElement.defaults, ...errorBarDefaults };

  /**
   * @hidden
   */
  static readonly defaultRoutes = PointElement.defaultRoutes;

  /**
   * @hidden
   */
  static readonly descriptors = errorBarDescriptors;
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    pointWithErrorBar: ScriptableAndArrayOptions<
      IErrorBarOptions & PointOptions & PointHoverOptions,
      ScriptableContext<TType>
    >;
  }
}
