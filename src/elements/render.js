import {allModelKeys, isSameArray} from '../data';

export const defaults = {
  errorBarLineWidth: [[1, 3]],
  errorBarColor: [['#2c2c2c', '#1f1f1f']],
  errorBarWhiskerLineWidth: [[1, 3]],
  errorBarWhiskerRatio: [[0.2, 0.25]],
  errorBarWhiskerSize: [[20, 24]],
  errorBarWhiskerColor: [['#2c2c2c', '#1f1f1f']]
};

export const styleKeys = Object.keys(defaults);

export function transitionErrorBarHelper(obj) {
  if (!obj) {
    return {};
  }
  const r = {};
  allModelKeys.forEach((key) => {
    r[key] = obj[key];
  });
  return r;
}

export function transitionErrorBar(start, startBak, view, model, ease) {
  allModelKeys.forEach((key) => {
    const m = model[key];

    if (!Array.isArray(m)) {
      // primitive are alrady handled
      return;
    }

    if (!view.hasOwnProperty(key)) {
      view[key] = m.slice();
      return;
    }

    let v = view[key];

    if (!startBak.hasOwnProperty(key)) {
      start[key] = v.slice();
    }

    const s = start[key];

    if (isSameArray(s, m)) {
      return;
    }

    const common = Math.min(m.length, s.length);
    v = view[key] = new Array(common);
    for (let i = 0; i < common; ++i) {
      v[i] = s[i] + (m[i] - s[i]) * ease;
    }
  });
}

function resolve(inputs, context, index) {
  for (let i = 0; i < inputs.length; ++i) {
    let value = inputs[i];
    if (value === undefined) {
      continue;
    }
    if (context !== undefined && typeof value === 'function') {
      value = value(context);
    }
    if (index !== undefined && Array.isArray(value)) {
      // use mod to repeat the value and not returning undefined
      value = value[index % value.length];
    }
    if (value !== undefined) {
      return value;
    }
  }
}

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

function resolveMulti(vMin, vMax) {
  const vMinArr = Array.isArray(vMin) ? vMin : [vMin];
  const vMaxArr = Array.isArray(vMax) ? vMax : [vMax];

  if (vMinArr.length === vMaxArr.length) {
    return vMinArr.map((v, i) => [v, vMaxArr[i]]);
  }
  const max = Math.max(vMinArr.length, vMaxArr.length);

  return Array(max).map((_, i) => [vMinArr[i % vMinArr.length], vMaxArr[i % vMaxArr.length]]);
}

function resolveOption(val, index) {
  if (!Array.isArray(val)) {
    return val;
  }
  return val[index % val.length];
}

function calcuateHalfSize(total, view, i) {
  const ratio = resolveOption(view.errorBarWhiskerRatio, i);
  if (total != null && ratio > 0) {
    return total * ratio * 0.5;
  }
  const size = resolveOption(view.errorBarWhiskerSize, i);
  return size * 0.5;
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

  const bars = resolveMulti(vMin, vMax);

  bars.reverse().forEach(([mi, ma], j) => {
    const i = bars.length - j - 1;
    const halfWidth = calcuateHalfSize(view.width, view, i);
    // center line
    ctx.lineWidth = resolveOption(view.errorBarLineWidth, i);
    ctx.strokeStyle = resolveOption(view.errorBarColor, i);
    ctx.beginPath();
    ctx.moveTo(0, mi);
    ctx.lineTo(0, ma);
    ctx.stroke();

    // whisker
    ctx.lineWidth = resolveOption(view.errorBarWhiskerLineWidth, i);
    ctx.strokeStyle = resolveOption(view.errorBarWhiskerColor, i);
    ctx.beginPath();
    ctx.moveTo(-halfWidth, mi);
    ctx.lineTo(halfWidth, mi);
    ctx.moveTo(-halfWidth, ma);
    ctx.lineTo(halfWidth, ma);
    ctx.stroke();
  });

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

  const bars = resolveMulti(vMin, vMax);

  bars.reverse().forEach(([mi, ma], j) => {
    const i = bars.length - j - 1;
    const halfHeight = calcuateHalfSize(view.height, view, i);
    // center line
    ctx.lineWidth = resolveOption(view.errorBarLineWidth, i);
    ctx.strokeStyle = resolveOption(view.errorBarColor, i);
    ctx.beginPath();
    ctx.moveTo(mi, 0);
    ctx.lineTo(ma, 0);
    ctx.stroke();

    // whisker
    ctx.lineWidth = resolveOption(view.errorBarWhiskerLineWidth, i);
    ctx.strokeStyle = resolveOption(view.errorBarWhiskerColor, i);
    ctx.beginPath();
    ctx.moveTo(mi, -halfHeight);
    ctx.lineTo(mi, halfHeight);
    ctx.moveTo(ma, -halfHeight);
    ctx.lineTo(ma, halfHeight);
    ctx.stroke();
  });

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
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  // perpendicular
  const v = {
    x: -sinAngle,
    y: cosAngle
  };
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  v.x /= length;
  v.y /= length;


  const bars = resolveMulti(vMin, vMax);

  bars.reverse().forEach(([mi, ma], j) => {
    const i = bars.length - j - 1;

    const minCos = mi * cosAngle;
    const minSin = mi * sinAngle;
    const maxCos = ma * cosAngle;
    const maxSin = ma * sinAngle;

    const halfHeight = calcuateHalfSize(null, view, i);
    const eX = v.x * halfHeight;
    const eY = v.y * halfHeight;

    // center line
    ctx.lineWidth = resolveOption(view.errorBarLineWidth, i);
    ctx.strokeStyle = resolveOption(view.errorBarColor, i);
    ctx.beginPath();
    ctx.moveTo(minCos, minSin);
    ctx.lineTo(maxCos, maxSin);
    ctx.stroke();

    // whisker
    ctx.lineWidth = resolveOption(view.errorBarWhiskerLineWidth, i);
    ctx.strokeStyle = resolveOption(view.errorBarWhiskerColor, i);
    ctx.beginPath();
    ctx.moveTo(minCos + eX, minSin + eY);
    ctx.lineTo(minCos - eX, minSin - eY);
    ctx.moveTo(maxCos + eX, maxSin + eY);
    ctx.lineTo(maxCos - eX, maxSin - eY);
    ctx.stroke();
  });

  ctx.restore();
}

export function renderErrorBarArc(view, ctx) {
  if (view.yMin != null || view.yMax != null) {
    drawErrorBarArc(view, view.yMin, view.yMax, ctx);
  }
}
