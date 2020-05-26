import { defaults, Point, registerElement } from '../chart';
import { renderErrorBar, errorBarDefaults } from './render';

export class PointWithErrorBar extends Point {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
PointWithErrorBar.id = 'pointWithErrorBar';
PointWithErrorBar.defaults = /*#__PURE__*/ Object.assign({}, defaults.elements.point, errorBarDefaults);
PointWithErrorBar.register = () => registerElement(PointWithErrorBar);
