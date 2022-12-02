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
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }

  static readonly id = 'arcWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...ArcElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = ArcElement.defaultRoutes;

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
