import { controllers, helpers, defaults } from 'chart.js';
import { calculateScale } from './utils';
import { styleObjectKeys } from '../elements/render';
import { PointWithErrorBar } from '../elements';
import { verticalTooltipDefaults } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';

export class LineWithErrorBars extends controllers.line {
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
    if (element instanceof PointWithErrorBar) {
      // inject the other error bar related properties
      calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    }
    super.updateElement(element, index, properties, mode);
  }
}
LineWithErrorBars.id = 'lineWithErrorBars';
LineWithErrorBars.defaults = helpers.merge({}, [defaults.line, verticalTooltipDefaults, animationHints]);
LineWithErrorBars.prototype.dataElementType = PointWithErrorBar;
LineWithErrorBars.prototype.dataElementOptions = Object.assign(
  {},
  controllers.line.prototype.dataElementOptions,
  styleObjectKeys
);
