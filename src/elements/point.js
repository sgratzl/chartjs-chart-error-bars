import { defaults, elements } from 'chart.js';
import { renderErrorBar, errorBarDefaults } from './render';

export class PointWithErrorBar extends elements.Point {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this.options, ctx);
  }
}
PointWithErrorBar._type = 'pointWithErrorBar';

defaults.set('elements', {
  [PointWithErrorBar._type]: Object.assign({}, defaults.elements.point, errorBarDefaults),
});
