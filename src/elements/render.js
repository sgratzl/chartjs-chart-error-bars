import * as Chart from 'chart.js';
import {modelKeys, isSameArray} from '../data';

export const defaults = {
  errorBarLineWidth: 1,
  errorBarColor: 'black',
  errorBarWhiskerLineWidth: 1,
  errorBarWhiskerRatio: 0.2,
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

export function renderErrorBar(view, ctx) {
  ctx.save();

  if (view.horizontal) {
    drawErrorBarHorizontal(view, view.xMin, view.xMax, ctx);
  } else {
    drawErrorBarVertical(view, view.yMin, view.yMax, ctx);
  }

  ctx.restore();
};

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
  const halfWidth = view.width * view.errorBarWhiskerRatio * 0.5;
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
  const y = view.y;
  const height = view.height;

  // center line
  ctx.lineWidth = view.errorBarLineWidth;
  ctx.strokeStyle = view.errorBarColor;
  ctx.beginPath();
  ctx.moveTo(vMin, y);
  ctx.lineTo(vMax, y);
  ctx.stroke();

  // whisker
  ctx.lineWidth = view.errorBarWhiskerLineWidth;
  ctx.strokeStyle = view.errorBarWhiskerColor;
  const halfHeight = height * view.errorBarWhiskerRatio * 0.5;
  ctx.beginPath();
  ctx.moveTo(vMin, y - halfHeight);
  ctx.lineTo(vMin, y + halfHeight);
  ctx.moveTo(vMax, y - halfHeight);
  ctx.lineTo(vMax, y + halfHeight);
  ctx.stroke();
}
