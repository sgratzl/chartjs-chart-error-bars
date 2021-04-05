import { PointElement } from 'chart.js';
import { renderErrorBar, errorBarDefaults, errorBarDescriptors } from './render';

export default class PointWithErrorBar extends PointElement {
  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    renderErrorBar(this as any, ctx);
  }

  static readonly id = 'pointWithErrorBar';

  static readonly defaults: any = /* #__PURE__ */ { ...PointElement.defaults, ...errorBarDefaults };

  static readonly defaultRoutes = PointElement.defaultRoutes;

  static readonly descriptors = errorBarDescriptors;
}
