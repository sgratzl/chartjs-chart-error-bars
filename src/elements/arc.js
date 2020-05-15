import { defaults, elements } from 'chart.js';
import { renderErrorBarArc, errorBarDefaults } from './render';

export class ArcWithErrorBar extends elements.Arc {
  // transition(ease) {
  //   // TODO
  //   const startBak = transitionErrorBarHelper(this._start);
  //   const r = Chart.elements.Arc.prototype.transition.call(this, ease);
  //   const model = this._model;
  //   const start = this._start;
  //   const view = this._view;

  //   // No animation -> No Transition
  //   if (!model || ease === 1) {
  //     return r;
  //   }

  //   transitionErrorBar(start, startBak, view, model, ease);

  //   return r;
  // }

  draw(ctx) {
    super.draw(ctx);

    renderErrorBarArc(this.options, ctx);
  }
}
ArcWithErrorBar._type = 'arcWithErrorBar';

defaults.set('elements', {
  [ArcWithErrorBar._type]: Object.assign({}, defaults.elements.arc, errorBarDefaults),
});
