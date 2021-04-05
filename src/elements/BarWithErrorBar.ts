import { BarElement } from 'chart.js';
import { renderErrorBar, errorBarDefaults, errorBarDescriptors } from './render';

export default class BarWithErrorBar extends BarElement {
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }

  static readonly id = 'rectangleWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...BarElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = BarElement.defaultRoutes;

  static readonly descriptors = errorBarDescriptors;
}
