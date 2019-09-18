import * as Chart from 'chart.js';
import {modelKeys, isSameArray} from '../data';

export const defaults = {
  errorBarLineWidth: 1,
  errorBarColor: 'black',
  errorBarWhiskerLineWidth: 1,
  errorBarWhiskerRatio: 0.2,
  errorBarWhiskerSize: 20,
  errorBarWhiskerColor: 'black'
};

export const styleKeys = Object.keys(defaults);

export function transitionErrorBar(start, view, model, ease) {
  const keys = modelKeys(view.horizontal);

  keys.forEach((key) => {
    const target = model[key];

    if (!Array.isArray(target)) {
      // primitive are alrady handled
      return;
    }

    const actual = view[key];

    if (!view.hasOwnProperty(key)) {
      view[key] = target.slice();
    }

    if (isSameArray(actual, target)) {
      return;
    }

    if (!start.hasOwnProperty(key)) {
      start[key] = actual.slice();
    }

    const origin = start[key];

    if (isSameArray(origin, target)) {
      return;
    }

    const common = Math.min(target.length, origin.length);
    for (let i = 0; i < common; ++i) {
      actual[i] = origin[i] + (target[i] - origin[i]) * ease;
    }

    view[key] = target.slice();
  });
}

const resolve = Chart.helpers.options.resolve;
/**
 * @param {number} index
 */
export function updateErrorBarElement(controller, elem, index) {
  const dataset = controller.getDataset();
  const custom = elem.custom || {};
  const options = controller._elementOptions();

  // Scriptable options
  const context = {
    chart: controller.chart,
    dataIndex: index,
    dataset,
    datasetIndex: controller.index
  };

  styleKeys.forEach((item) => {
    elem._model[item] = resolve([custom[item], dataset[item], options[item]], context, index);
  });
}

function calcuateHalfSize(total, view) {
  if (total != null && view.errorBarWhiskerRatio > 0) {
    return total * view.errorBarWhiskerRatio * 0.5;
  }
  return view.errorBarWhiskerSize * 0.5;
}

/**
 * @param {number} vMin
 * @param {number} vMax
 * @param {CanvasRenderingContext2D} ctx
 */
function drawErrorBarVertical(view, vMin, vMax, ctx) {
  ctx.translate(view.x, 0);

  // center line
  ctx.lineWidth = view.errorBarLineWidth;
  ctx.strokeStyle = view.errorBarColor;
  ctx.beginPath();
  ctx.moveTo(0, vMin);
  ctx.lineTo(0, vMax);
  ctx.stroke();

  // whisker
  ctx.lineWidth = view.errorBarWhiskerLineWidth;
  ctx.strokeStyle = view.errorBarWhiskerColor;
  const halfWidth = calcuateHalfSize(view.width, view);
  ctx.beginPath();
  ctx.moveTo(-halfWidth, vMin);
  ctx.lineTo(halfWidth, vMin);
  ctx.moveTo(-halfWidth, vMax);
  ctx.lineTo(halfWidth, vMax);
  ctx.stroke();
}

/**
 * @param {number} vMin
 * @param {number} vMax
 * @param {CanvasRenderingContext2D} ctx
 */
function drawErrorBarHorizontal(view, vMin, vMax, ctx) {
  ctx.translate(0, view.y);

  // center line
  ctx.lineWidth = view.errorBarLineWidth;
  ctx.strokeStyle = view.errorBarColor;
  ctx.beginPath();
  ctx.moveTo(vMin, 0);
  ctx.lineTo(vMax, 0);
  ctx.stroke();

  // whisker
  ctx.lineWidth = view.errorBarWhiskerLineWidth;
  ctx.strokeStyle = view.errorBarWhiskerColor;
  const halfHeight = calcuateHalfSize(view.height, view);
  ctx.beginPath();
  ctx.moveTo(vMin, -halfHeight);
  ctx.lineTo(vMin, halfHeight);
  ctx.moveTo(vMax, -halfHeight);
  ctx.lineTo(vMax, halfHeight);
  ctx.stroke();
}

export function renderErrorBar(view, ctx) {
  ctx.save();

  if (view.horizontal) {
    drawErrorBarHorizontal(view, view.xMin, view.xMax, ctx);
  } else {
    drawErrorBarVertical(view, view.yMin, view.yMax, ctx);
  }

  ctx.restore();
}
