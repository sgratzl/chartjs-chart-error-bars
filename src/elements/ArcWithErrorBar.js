import { defaults, Arc, registerElement } from '../chart';
import { renderErrorBarArc, errorBarDefaults } from './render';

export class ArcWithErrorBar extends Arc {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }
}
ArcWithErrorBar.id = 'arcWithErrorBar';
ArcWithErrorBar.defaults = /*#__PURE__*/ Object.assign({}, defaults.elements.arc, errorBarDefaults);
ArcWithErrorBar.register = () => registerElement(ArcWithErrorBar);
