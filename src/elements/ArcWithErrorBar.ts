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
   * @hidden
   */
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }

  static readonly id = 'arcWithErrorBar';

  /**
   * @hidden
   */
  static readonly defaults: any = /* #__PURE__ */ { ...ArcElement.defaults, ...errorBarDefaults };

  /**
   * @hidden
   */
  static readonly defaultRoutes = ArcElement.defaultRoutes;

  /**
   * @hidden
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
