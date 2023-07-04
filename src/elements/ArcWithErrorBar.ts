import {
  ArcElement,
  ArcOptions,
  ArcHoverOptions,
  ChartType,
  ScriptableAndArrayOptions,
  ScriptableContext,
} from 'chart.js';
import { renderErrorBarArc, errorBarDefaults, errorBarDescriptors, IErrorBarOptions } from './render';

export default class ArcWithErrorBar extends ArcElement {
  /**
   * @internal
   */
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }

  /**
   * @internal
   */
  static readonly id = 'arcWithErrorBar';

  /**
   * @internal
   */
  static readonly defaults: any = /* #__PURE__ */ { ...ArcElement.defaults, ...errorBarDefaults };

  /**
   * @internal
   */
  static readonly defaultRoutes = ArcElement.defaultRoutes;

  /**
   * @internal
   */
  static readonly descriptors = errorBarDescriptors;
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    arcWithErrorBar: ScriptableAndArrayOptions<
      IErrorBarOptions & ArcOptions & ArcHoverOptions,
      ScriptableContext<TType>
    >;
  }
}
