import type { Element, ArcProps } from 'chart.js';

export const errorBarDefaults = {
  errorBarLineWidth: { v: [1, 3] },
  errorBarColor: { v: ['#2c2c2c', '#1f1f1f'] },
  errorBarWhiskerLineWidth: { v: [1, 3] },
  errorBarWhiskerRatio: { v: [0.2, 0.25] },
  errorBarWhiskerSize: { v: [20, 24] },
  errorBarWhiskerColor: { v: ['#2c2c2c', '#1f1f1f'] },
};

export const errorBarDescriptors = /* #__PURE__ */ {
  _scriptable: true,
  _indexable: (name: string): boolean => name !== 'v',
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

function resolveMulti(vMin: number | number[], vMax: number | number[]) {
  const vMinArr = Array.isArray(vMin) ? vMin : [vMin];
  const vMaxArr = Array.isArray(vMax) ? vMax : [vMax];

  if (vMinArr.length === vMaxArr.length) {
    return vMinArr.map((v, i) => [v, vMaxArr[i]]);
  }
  const max = Math.max(vMinArr.length, vMaxArr.length);

  return Array(max).map((_, i) => [vMinArr[i % vMinArr.length], vMaxArr[i % vMaxArr.length]]);
}

function resolveOption<T extends string | number>(val: T | { v: T[] }, index: number): T;
function resolveOption<T extends string | number>(val: readonly T[], index: number): T;
function resolveOption<T extends string | number>(val: T | { v: T[] } | readonly T[], index: number) {
  if (typeof val === 'string' || typeof val === 'number') {
    return val;
  }
  const v = Array.isArray(val) ? val : (val as unknown as { v: T[] }).v;
  return v[index % v.length];
}

function calculateHalfSize(total: number | null, options: IErrorBarOptions, i: number) {
  const ratio = resolveOption(options.errorBarWhiskerRatio, i);
  if (total != null && ratio > 0) {
    return total * ratio * 0.5;
  }
  const size = resolveOption(options.errorBarWhiskerSize, i);
  return size * 0.5;
}

function drawErrorBarVertical(
  props: IErrorBarProps,
  vMin: null | number | number[],
  vMax: null | number | number[],
  options: IErrorBarOptions,
  ctx: CanvasRenderingContext2D
) {
  ctx.save();
  ctx.translate(props.x, 0);

  const bars = resolveMulti(vMin == null ? props.y : vMin, vMax == null ? props.y : vMax);

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

function drawErrorBarHorizontal(
  props: IErrorBarProps,
  vMin: null | number | number[],
  vMax: null | number | number[],
  options: IErrorBarOptions,
  ctx: CanvasRenderingContext2D
) {
  ctx.save();
  ctx.translate(0, props.y);

  const bars = resolveMulti(vMin == null ? props.x : vMin, vMax == null ? props.x : vMax);

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
  xMin?: number | number[];
  yMin?: number | number[];
  xMax?: number | number[];
  yMax?: number | number[];
}

export function renderErrorBar<P extends IErrorBarProps, O>(elem: Element<P, O>, ctx: CanvasRenderingContext2D): void {
  const props = elem.getProps(['x', 'y', 'width', 'height', 'xMin', 'xMax', 'yMin', 'yMax']);
  if (props.xMin != null || props.xMax != null) {
    drawErrorBarHorizontal(props, props.xMin ?? null, props.xMax ?? null, elem.options as any, ctx);
  }
  if (props.yMin != null || props.yMax != null) {
    drawErrorBarVertical(props, props.yMin ?? null, props.yMax ?? null, elem.options as any, ctx);
  }
}

/**
 * @param {number} vMin
 * @param {number} vMax
 * @param {CanvasRenderingContext2D} ctx
 */
function drawErrorBarArc(
  props: ArcProps,
  vMin: null | number | number[],
  vMax: null | number | number[],
  options: IErrorBarOptions,
  ctx: CanvasRenderingContext2D
) {
  ctx.save();
  ctx.translate(props.x, props.y); // move to center

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

  const bars = resolveMulti(vMin ?? props.outerRadius, vMax ?? props.outerRadius);

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function renderErrorBarArc(elem: any, ctx: CanvasRenderingContext2D): void {
  const props = elem.getProps(['x', 'y', 'startAngle', 'endAngle', 'rMin', 'rMax', 'outerRadius']);
  if (props.rMin != null || props.rMax != null) {
    drawErrorBarArc(props, props.rMin, props.rMax, elem.options as any, ctx);
  }
}
