import { BarElement } from 'chart.js';
import { renderErrorBar, errorBarDefaults } from './render';

export class BarWithErrorBar extends BarElement {
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }

  static readonly id = 'rectangleWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...BarElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = BarElement.defaultRoutes;
}
