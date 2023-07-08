import {
  BarElement,
  BarHoverOptions,
  BarOptions,
  ChartType,
  ScriptableAndArrayOptions,
  ScriptableContext,
} from 'chart.js';
import { renderErrorBar, errorBarDefaults, errorBarDescriptors, IErrorBarOptions } from './render';

export default class BarWithErrorBar extends BarElement {
  /**
   * @internal
   */
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }

  static readonly id = 'barWithErrorBar';

  /**
   * @internal
   */
  static readonly defaults: any = /* #__PURE__ */ { ...BarElement.defaults, ...errorBarDefaults };

  /**
   * @internal
   */
  static readonly defaultRoutes = BarElement.defaultRoutes;

  /**
   * @internal
   */
  static readonly descriptors = errorBarDescriptors;
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    barWithErrorBar: ScriptableAndArrayOptions<
      IErrorBarOptions & BarOptions & BarHoverOptions,
      ScriptableContext<TType>
    >;
  }
}
