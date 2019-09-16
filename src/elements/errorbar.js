'use strict';

import * as Chart from 'chart.js';

export const defaults = {
  ...Chart.defaults.global.elements.rectangle,
  // list default opitons
};

Chart.defaults.global.elements.errorbar = {...defaults};

const ErrorBarElement = Chart.elements.errorbar = Chart.Element.extend({
  transition(ease) {
    const r = Chart.Element.prototype.transition.call(this, ease);
    const model = this._model;
    const start = this._start;
    const view = this._view;

    // No animation -> No Transition
    if (!model || ease === 1) {
      return r;
    }
    // if (start.boxplot == null) {
    //   return r; // model === view -> not copied
    // }

    // // create deep copy to avoid alternation
    // if (model.boxplot === view.boxplot) {
    //   view.boxplot = Chart.helpers.clone(view.boxplot);
    // }
    // transitionBoxPlot(start.boxplot, view.boxplot, model.boxplot, ease);

    return r;
  },
  draw() {
    const ctx = this._chart.ctx;
    const vm = this._view;

    const errorbar = vm.errorbar;
    const vert = this.isVertical();


    ctx.save();

    this._drawErrorBar(vm, errorbar, ctx, vert);

    ctx.restore();

  },
  _drawErrorBar(vm, errorbar, ctx, vert) {
    if (vert) {
      this._drawErrorBarVertical(vm, errorbar, ctx);
    } else {
      this._drawErrorBarHorizontal(vm, errorbar, ctx);
    }

  },
  _drawErrorBarVertical(vm, boxplot, ctx) {
    const x = vm.x;
    const width = vm.width;
    const x0 = x - width / 2;

    // TODO

  },
  _drawErrorBarHorizontal(vm, boxplot, ctx) {
    const y = vm.y;
    const height = vm.height;
    const y0 = y - height / 2;

    // TODO

  },
  _getBounds() {
    const vm = this._view;

    const vert = this.isVertical();
    const errorbar = vm.errorbar;

    if (!errorbar) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      };
    }

    // if (vert) {
    //   const {x, width} = vm;
    //   const x0 = x - width / 2;
    //   return {
    //     left: x0,
    //     top: boxplot.whiskerMax,
    //     right: x0 + width,
    //     bottom: boxplot.whiskerMin
    //   };
    // }
    // const {y, height} = vm;
    // const y0 = y - height / 2;
    // return {
    //   left: boxplot.whiskerMin,
    //   top: y0,
    //   right: boxplot.whiskerMax,
    //   bottom: y0 + height
    // };
  },
  isVertical() {
    return this._view.width !== undefined;
  },
  inRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  inLabelRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getBounds();
    if (this.isVertical()) {
      return mouseX >= bounds.left && mouseX <= bounds.right;
    }
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  inXRange(mouseX) {
    const bounds = this._getBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right;
  },
  inYRange(mouseY) {
    const bounds = this._getBounds();
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  getCenterPoint() {
    const {x, y} = this._view;
    return {x, y};
  },
  tooltipPosition_() {
    return this.getCenterPoint();
  },
  height() {
    const vm = this._view;
    return vm.base - Math.min(vm.boxplot.q1, vm.boxplot.q3);
  },
  getArea() {
    const vm = this._view;
    const iqr = Math.abs(vm.boxplot.q3 - vm.boxplot.q1);
    if (this.isVertical()) {
      return iqr * vm.width;
    }
    return iqr * vm.height;
  },
});

export default ErrorBarElement;
