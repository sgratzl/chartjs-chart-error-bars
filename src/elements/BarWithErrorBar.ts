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
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }

  static readonly id = 'barWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...BarElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = BarElement.defaultRoutes;

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
