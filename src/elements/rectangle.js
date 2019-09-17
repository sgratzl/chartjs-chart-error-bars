'use strict';

import * as Chart from 'chart.js';

export const defaults = {
  // TODO list default opitons
};

Chart.defaults.global.elements.rectangleWithErrorBar = {
  ...Chart.defaults.global.elements.rectangle,
  ...defaults
};

export const RectangleWithErrorBar = Chart.elements.RectangleWithErrorBar = Chart.elements.Rectangle.extend({
  transition(ease) {
    const r = Chart.elements.Rectangle.prototype.transition.call(this, ease);
    const model = this._model;
    const start = this._start;
    const view = this._view;

    // No animation -> No Transition
    if (!model || ease === 1) {
      return r;
    }

    // // create deep copy to avoid alternation
    // if (model.boxplot === view.boxplot) {
    //   view.boxplot = Chart.helpers.clone(view.boxplot);
    // }
    // transitionBoxPlot(start.boxplot, view.boxplot, model.boxplot, ease);

    return r;
  },
  draw() {
    Chart.elements.Rectangle.prototype.draw.call(this);

    const ctx = this._chart.ctx;
    const vm = this._view;

    ctx.save();

    if (vm.horizontal) {
      this._drawErrorBarHorizontal(vm, vm.yMin, vm.yMax, ctx);
    } else {
      this._drawErrorBarVertical(vm, vm.xMin, vm.xMax, ctx);
    }

    ctx.restore();

  },
  _drawErrorBarVertical(vm, vMin, vMax, ctx) {
    const x = vm.x;
    const width = vm.width;
    const x0 = x - width / 2;

    // TODO

  },
  _drawErrorBarHorizontal(vm, vMin, vMax, ctx) {
    const y = vm.y;
    const height = vm.height;
    const y0 = y - height / 2;

    // TODO

  }
});
