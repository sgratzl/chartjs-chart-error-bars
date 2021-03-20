import { PointElement } from 'chart.js';
import { renderErrorBar, errorBarDefaults } from './render';

export class PointWithErrorBar extends PointElement {
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    renderErrorBar(this as any, ctx);
  }

  static readonly id = 'pointWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...PointElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = PointElement.defaultRoutes;
}
