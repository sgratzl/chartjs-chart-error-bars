import { ArcElement } from 'chart.js';
import { renderErrorBarArc, errorBarDefaults } from './render';

export default class ArcWithErrorBar extends ArcElement {
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }

  static readonly id = 'arcWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...ArcElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = ArcElement.defaultRoutes;
}
