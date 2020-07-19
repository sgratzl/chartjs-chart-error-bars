import { Chart, BarController, merge } from '@sgratzl/chartjs-esm-facade';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';
import patchController from './patchController';

export class BarWithErrorBarsController extends BarController {
  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale, data, start, count);
    parseErrorLabelData(parsed, meta.iScale, start, count);
    return parsed;
  }

  updateElement(element, index, properties, mode) {
    // inject the other error bar related properties
    calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    super.updateElement(element, index, properties, mode);
  }
}
BarWithErrorBarsController.id = 'barWithErrorBars';
BarWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [
  BarController.defaults,
  animationHints,
  {
    tooltips: {
      callbacks: {
        label: generateBarTooltip,
      },
    },
    dataElementOptions: BarController.defaults.dataElementOptions.concat(styleKeys),
    dataElementType: RectangleWithErrorBar.id,
  },
]);

export class BarWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchController(config, BarWithErrorBarsController, RectangleWithErrorBar));
  }
}
BarWithErrorBarsChart.id = BarWithErrorBarsController.id;
