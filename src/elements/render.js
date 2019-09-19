import * as Chart from 'chart.js';
import {allModelKeys, isSameArray} from '../data';

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
  allModelKeys.forEach((key) => {
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
  ctx.save();
  ctx.translate(view.x, 0);

  if (vMin == null) {
    vMin = view.y;
  }
  if (vMax == null) {
    vMax = view.y;
  }

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

  ctx.restore();
}

/**
 * @param {number} vMin
 * @param {number} vMax
 * @param {CanvasRenderingContext2D} ctx
 */
function drawErrorBarHorizontal(view, vMin, vMax, ctx) {
  ctx.save();
  ctx.translate(0, view.y);

  if (vMin == null) {
    vMin = view.x;
  }
  if (vMax == null) {
    vMax = view.x;
  }

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

  ctx.restore();
}

export function renderErrorBar(view, ctx) {
  if (view.xMin != null || view.xMax != null) {
    drawErrorBarHorizontal(view, view.xMin, view.xMax, ctx);
  }
  if (view.yMin != null || view.yMax != null) {
    drawErrorBarVertical(view, view.yMin, view.yMax, ctx);
  }
}

/**
 * @param {number} vMin
 * @param {number} vMax
 * @param {CanvasRenderingContext2D} ctx
 */
function drawErrorBarArc(view, vMin, vMax, ctx) {
  ctx.save();
  ctx.translate(view.x, view.y); // move to center

  if (vMin == null) {
    vMin = view.outerRadius;
  }
  if (vMax == null) {
    vMax = view.outerRadius;
  }

  const angle = (view.startAngle + view.endAngle) / 2;

  // center line
  ctx.lineWidth = view.errorBarLineWidth;
  ctx.strokeStyle = view.errorBarColor;
  ctx.beginPath();
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  ctx.moveTo(cosAngle * vMin, sinAngle * vMin);
  ctx.lineTo(cosAngle * vMax, sinAngle * vMax);
  ctx.stroke();

  // whisker
  ctx.lineWidth = view.errorBarWhiskerLineWidth;
  ctx.strokeStyle = view.errorBarWhiskerColor;
  const halfHeight = calcuateHalfSize(null, view);

  // perpendicular
  const v = {
    x: -sinAngle,
    y: cosAngle
  };
  const length = Math.hypot(v.x, v.y);
  v.x /= length;
  v.y /= length;

  ctx.beginPath();
  ctx.moveTo(cosAngle * vMin + v.x * halfHeight, sinAngle * vMin + v.y * halfHeight);
  ctx.lineTo(cosAngle * vMin - v.x * halfHeight, sinAngle * vMin - v.y * halfHeight);
  ctx.moveTo(cosAngle * vMax + v.x * halfHeight, sinAngle * vMax + v.y * halfHeight);
  ctx.lineTo(cosAngle * vMax - v.x * halfHeight, sinAngle * vMax - v.y * halfHeight);
  ctx.stroke();

  ctx.restore();
}

export function renderErrorBarArc(view, ctx) {
  if (view.yMin != null || view.yMax != null) {
    drawErrorBarArc(view, view.yMin, view.yMax, ctx);
  }
}
