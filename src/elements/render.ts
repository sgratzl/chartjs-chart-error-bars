import { Element } from 'chart.js';
import { ArcWithErrorBar } from './ArcWithErrorBar';

export const errorBarDefaults = {
  errorBarLineWidth: { v: [1, 3] },
  errorBarColor: { v: ['#2c2c2c', '#1f1f1f'] },
  errorBarWhiskerLineWidth: { v: [1, 3] },
  errorBarWhiskerRatio: { v: [0.2, 0.25] },
  errorBarWhiskerSize: { v: [20, 24] },
  errorBarWhiskerColor: { v: ['#2c2c2c', '#1f1f1f'] },
};

export interface IErrorBarOptions {
  /**
   * line width of the center line
   * @default {v: [1, 3]}
   * @scriptable
   */
  errorBarLineWidth: number | { v: number[] };
  /**
   * color of the center line
   * @default {v: ['#2c2c2c', '#1f1f1f']}
   * @scriptable
   */
  errorBarColor: string | { v: string[] };
  /**
   * line width of the whisker lines
   * @default {v: [1, 3]}
   * @scriptable
   */
  errorBarWhiskerLineWidth: number | { v: number[] };
  /**
   * width of the whiskers in relation to the bar width, use `0` to force a fixed with, see below
   * @default {v: [0.2, 0.25]}
   * @scriptable
   */
  errorBarWhiskerRatio: number | { v: number[] };
  /**
   * pixel width of the whiskers for non bar chart cases
   * @default {v: [20, 24]}
   * @scriptable
   */
  errorBarWhiskerSize: number | { v: number[] };
  /**
   * color of the whisker lines
   * @default {v: ['#2c2c2c', '#1f1f1f']}
   * @scriptable
   */
  errorBarWhiskerColor: string | { v: string[] };
}

export const styleKeys = Object.keys(errorBarDefaults);

export const styleObjectKeys: Record<string, string> = {};
styleKeys.forEach((key) => (styleObjectKeys[key] = key));

function resolveMulti(vMin: number | number[], vMax: number | number[]) {
  const vMinArr = Array.isArray(vMin) ? vMin : [vMin];
  const vMaxArr = Array.isArray(vMax) ? vMax : [vMax];

  if (vMinArr.length === vMaxArr.length) {
    return vMinArr.map((v, i) => [v, vMaxArr[i]]);
  }
  const max = Math.max(vMinArr.length, vMaxArr.length);

  return Array(max).map((_, i) => [vMinArr[i % vMinArr.length], vMaxArr[i % vMaxArr.length]]);
}

function resolveOption<T>(val: T, index: number): T;
function resolveOption<T>(val: readonly T[], index: number): T;
function resolveOption<T>(val: T | readonly T[], index: number) {
  if (typeof val === 'string' || typeof val === 'number') {
    return val;
  }
  const v = Array.isArray(val) ? val : val.v;
  return v[index % v.length];
}

function calculateHalfSize(total: number | null, options, i: number) {
  const ratio = resolveOption(options.errorBarWhiskerRatio, i);
  if (total != null && ratio > 0) {
    return total * ratio * 0.5;
  }
  const size = resolveOption(options.errorBarWhiskerSize, i);
  return size * 0.5;
}

function drawErrorBarVertical(props, vMin, vMax, options, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(props.x, 0);

  if (vMin == null) {
    vMin = props.y;
  }
  if (vMax == null) {
    vMax = props.y;
  }

  const bars = resolveMulti(vMin, vMax);

  bars.reverse().forEach(([mi, ma], j) => {
    const i = bars.length - j - 1;
    const halfWidth = calculateHalfSize(props.width, options, i);
    // center line
    ctx.lineWidth = resolveOption(options.errorBarLineWidth, i);
    ctx.strokeStyle = resolveOption(options.errorBarColor, i);
    ctx.beginPath();
    ctx.moveTo(0, mi);
    ctx.lineTo(0, ma);
    ctx.stroke();

    // whisker
    ctx.lineWidth = resolveOption(options.errorBarWhiskerLineWidth, i);
    ctx.strokeStyle = resolveOption(options.errorBarWhiskerColor, i);
    ctx.beginPath();
    ctx.moveTo(-halfWidth, mi);
    ctx.lineTo(halfWidth, mi);
    ctx.moveTo(-halfWidth, ma);
    ctx.lineTo(halfWidth, ma);
    ctx.stroke();
  });

  ctx.restore();
}

function drawErrorBarHorizontal(props, vMin, vMax, options, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(0, props.y);

  if (vMin == null) {
    vMin = props.x;
  }
  if (vMax == null) {
    vMax = props.x;
  }

  const bars = resolveMulti(vMin, vMax);

  bars.reverse().forEach(([mi, ma], j) => {
    const i = bars.length - j - 1;
    const halfHeight = calculateHalfSize(props.height, options, i);
    // center line
    ctx.lineWidth = resolveOption(options.errorBarLineWidth, i);
    ctx.strokeStyle = resolveOption(options.errorBarColor, i);
    ctx.beginPath();
    ctx.moveTo(mi, 0);
    ctx.lineTo(ma, 0);
    ctx.stroke();

    // whisker
    ctx.lineWidth = resolveOption(options.errorBarWhiskerLineWidth, i);
    ctx.strokeStyle = resolveOption(options.errorBarWhiskerColor, i);
    ctx.beginPath();
    ctx.moveTo(mi, -halfHeight);
    ctx.lineTo(mi, halfHeight);
    ctx.moveTo(ma, -halfHeight);
    ctx.lineTo(ma, halfHeight);
    ctx.stroke();
  });

  ctx.restore();
}

export interface IErrorBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  xMin?: number;
  yMin?: number;
  xMax?: number;
  yMax?: number;
}

export function renderErrorBar<P extends IErrorBarProps, O>(elem: Element<P, O>, ctx: CanvasRenderingContext2D) {
  const props = elem.getProps(['x', 'y', 'width', 'height', 'xMin', 'xMax', 'yMin', 'yMax']);
  if (props.xMin != null || props.xMax != null) {
    drawErrorBarHorizontal(props, props.xMin, props.xMax, elem.options, ctx);
  }
  if (props.yMin != null || props.yMax != null) {
    drawErrorBarVertical(props, props.yMin, props.yMax, elem.options, ctx);
  }
}

/**
 * @param {number} vMin
 * @param {number} vMax
 * @param {CanvasRenderingContext2D} ctx
 */
function drawErrorBarArc(props, vMin, vMax, options, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(props.x, props.y); // move to center

  if (vMin == null) {
    vMin = props.outerRadius;
  }
  if (vMax == null) {
    vMax = props.outerRadius;
  }

  const angle = (props.startAngle + props.endAngle) / 2;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  // perpendicular
  const v = {
    x: -sinAngle,
    y: cosAngle,
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

    const halfHeight = calculateHalfSize(null, options, i);
    const eX = v.x * halfHeight;
    const eY = v.y * halfHeight;

    // center line
    ctx.lineWidth = resolveOption(options.errorBarLineWidth, i);
    ctx.strokeStyle = resolveOption(options.errorBarColor, i);
    ctx.beginPath();
    ctx.moveTo(minCos, minSin);
    ctx.lineTo(maxCos, maxSin);
    ctx.stroke();

    // whisker
    ctx.lineWidth = resolveOption(options.errorBarWhiskerLineWidth, i);
    ctx.strokeStyle = resolveOption(options.errorBarWhiskerColor, i);
    ctx.beginPath();
    ctx.moveTo(minCos + eX, minSin + eY);
    ctx.lineTo(minCos - eX, minSin - eY);
    ctx.moveTo(maxCos + eX, maxSin + eY);
    ctx.lineTo(maxCos - eX, maxSin - eY);
    ctx.stroke();
  });

  ctx.restore();
}

export function renderErrorBarArc(elem: ArcWithErrorBar, ctx: CanvasRenderingContext2D) {
  const props = elem.getProps(['x', 'y', 'startAngle', 'endAngle', 'rMin', 'rMax', 'outerRadius']);
  if (props.rMin != null || props.rMax != null) {
    drawErrorBarArc(props, props.rMin, props.rMax, elem.options, ctx);
  }
}
