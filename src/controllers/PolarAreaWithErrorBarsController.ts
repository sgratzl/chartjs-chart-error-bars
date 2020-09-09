import { Chart, PolarAreaController, merge, resolve, RadialLinearScale } from 'chart.js';
import { calculatePolarScale } from './utils';
import { getMinMax, parseErrorNumberData } from './base';
import { generateTooltipPolar } from './tooltip';
import { animationHints } from '../animate';
import { ArcWithErrorBar } from '../elements';
import { styleKeys } from '../elements/render';
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
    const scale = meta.rScale;
    for (let i = 0; i < count; ++i) {
      const index = i + start;
      const item = data[index];
      const v = scale.parse(item[scale.axis], index);
      parsed[i] = {
        [scale.axis]: v,
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
    dataElementOptions: PolarAreaController.defaults.dataElementOptions.concat(styleKeys),
  },
]);

export class PolarAreaWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchController(config, PolarAreaWithErrorBarsController, ArcWithErrorBar, RadialLinearScale));
  }
}
PolarAreaWithErrorBarsChart.id = PolarAreaWithErrorBarsController.id;
