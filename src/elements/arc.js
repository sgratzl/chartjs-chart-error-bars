import { defaults, Arc } from '../chart';
import { renderErrorBarArc, errorBarDefaults } from './render';

export class ArcWithErrorBar extends Arc {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }
}
ArcWithErrorBar._type = 'arcWithErrorBar';
ArcWithErrorBar.register = () => {
  defaults.set('elements', {
    [ArcWithErrorBar._type]: Object.assign({}, defaults.elements.arc, errorBarDefaults),
  });
  return ArcWithErrorBar;
};
