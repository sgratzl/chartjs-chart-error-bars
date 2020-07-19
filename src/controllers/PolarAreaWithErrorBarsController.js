﻿import { Chart, PolarAreaController, merge, resolve } from '@sgratzl/chartjs-esm-facade';
import { calculatePolarScale } from './utils';
import { getMinMax, parseErrorNumberData } from './base';
import { generateTooltipPolar } from './tooltip';
import { animationHints } from '../animate';
import { ArcWithErrorBar } from '../elements';
import { styleObjectKeys } from '../elements/render';
import patchController from './patchController';

export class PolarAreaWithErrorBarsController extends PolarAreaController {
  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  countVisibleElements() {
    const meta = this._cachedMeta;
    return meta.data.reduce((acc, _, index) => {
      // use different data lookup
      if (!Number.isNaN(meta._parsed[index].r) && this.chart.getDataVisibility(index)) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  _computeAngle(index) {
    const meta = this._cachedMeta;
    const count = meta.count;
    // use different data lookup
    if (Number.isNaN(meta._parsed[index].r) || !this.chart.getDataVisibility(index)) {
      return 0;
    }
    const context = this._getContext(index, true);
    return resolve([this.chart.options.elements.arc.angle, (2 * Math.PI) / count], context, index);
  }

  parseObjectData(meta, data, start, count) {
    const parsed = new Array(count);
    for (let i = 0; i < count; ++i) {
      const index = i + start;
      const item = data[index];
      const v = meta.rScale.parseObject(item, 'r', index);
      parsed[i] = {
        [meta.rScale.axis]: v,
      };
    }
    parseErrorNumberData(parsed, meta.rScale, data, start, count);
    return parsed;
  }

  updateElement(element, index, properties, mode) {
    calculatePolarScale(
      element,
      properties,
      this.getParsed(index),
      this._cachedMeta.rScale,
      mode === 'reset',
      this.chart.options
    );
    super.updateElement(element, index, properties, mode);
  }

  updateElements(arcs, start, mode) {
    const scale = this.chart.scales.r;
    const bak = scale.getDistanceFromCenterForValue;
    scale.getDistanceFromCenterForValue = function (v) {
      if (typeof v === 'number') {
        return bak.call(this, v);
      }
      return bak.call(this, v.r);
    };
    super.updateElements(arcs, start, mode);
    scale.getDistanceFromCenterForValue = bak;
  }
}

PolarAreaWithErrorBarsController.id = 'polarAreaWithErrorBars';
PolarAreaWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [
  PolarAreaController.defaults,
  animationHints,
  {
    tooltips: {
      callbacks: {
        label: generateTooltipPolar,
      },
    },
    dataElementType: ArcWithErrorBar.id,
    dataElementOptions: Object.assign({}, PolarAreaController.defaults.dataElementOptions, styleObjectKeys),
  },
]);

export class PolarAreaWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchController(config, PolarAreaWithErrorBarsController, ArcWithErrorBar));
  }
}
PolarAreaWithErrorBarsChart.id = PolarAreaWithErrorBarsController.id;
