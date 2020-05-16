import { controllers, helpers, defaults, DatasetController } from 'chart.js';
import { calculateScale } from './utils';
import { getMinMax, parseErrorNumberData } from './base';
import { generateTooltipPolar } from './tooltip';
import { animationHints } from '../animate';
import { ArcWithErrorBar } from '../elements';
import { styleObjectKeys } from '../elements/render';

const tooltipDefaults = {
  tooltips: {
    callbacks: {
      label: generateTooltipPolar,
    },
  },
};

export class PolarAreaWithErrorBars extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.innerRadius = undefined;
    this.outerRadius = undefined;
  }

  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  update(mode) {
    const arcs = this._cachedMeta.data;
    this._updateRadius();
    this.updateElements(arcs, 0, mode);
  }

  _updateRadius() {
    var me = this;
    var chart = me.chart;
    var chartArea = chart.chartArea;
    var opts = chart.options;
    var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    var outerRadius = Math.max(minSize / 2, 0);
    var innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
    var radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
    me.outerRadius = outerRadius - radiusLength * me.index;
    me.innerRadius = me.outerRadius - radiusLength;
  }

  updateElements(arcs, start, mode) {
    var me = this;
    var reset = mode === 'reset';
    var chart = me.chart;
    var dataset = me.getDataset();
    var opts = chart.options;
    var animationOpts = opts.animation;
    var scale = chart.scales.r;
    var centerX = scale.xCenter;
    var centerY = scale.yCenter;
    var datasetStartAngle = getStartAngleRadians(opts.startAngle);
    var angle = datasetStartAngle;
    var i;
    me._cachedMeta.count = me.countVisibleElements();
    for (i = 0; i < start; ++i) {
      angle += me._computeAngle(i);
    }
    for (i = 0; i < arcs.length; i++) {
      var arc = arcs[i];
      var index = start + i;
      var startAngle = angle;
      var endAngle = angle + me._computeAngle(index);
      var outerRadius = this.chart.getDataVisibility(index) ? scale.getDistanceFromCenterForValue(dataset.data[index]) : 0;
      angle = endAngle;
      if (reset) {
        if (animationOpts.animateScale) {
          outerRadius = 0;
        }
        if (animationOpts.animateRotate) {
          startAngle = datasetStartAngle;
          endAngle = datasetStartAngle;
        }
      }
      var properties = {
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle,
        options: me.resolveDataElementOptions(index)
      };
      me.updateElement(arc, index, properties, mode);
    }
  }
  countVisibleElements() {
    var dataset = this.getDataset();
    var meta = this._cachedMeta;
    var count = 0;
    meta.data.forEach((element, index) => {
      if (!isNaN(dataset.data[index]) && this.chart.getDataVisibility(index)) {
        count++;
      }
    });
    return count;
  }
  _computeAngle(index) {
    var me = this;
    var meta = me._cachedMeta;
    var count = meta.count;
    var dataset = me.getDataset();
    if (isNaN(dataset.data[index]) || !this.chart.getDataVisibility(index)) {
      return 0;
    }
    var context = {
      chart: me.chart,
      dataIndex: index,
      dataset,
      datasetIndex: me.index
    };
    return resolve([me.chart.options.elements.arc.angle, 2 * Math.PI / count], context, index);
  }
}

  parseObjectData(meta, data, start, count) {
    const xScale = meta.xScale;
    meta.xScale = meta.rScale;
    meta.yScale = meta.rScale;
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.rScale, data, start, count);
    return parsed;
  }

  updateElement(element, index, properties, mode) {
    calculateScale(properties, this.getParsed(index), this._cachedMeta.rScale, mode === 'reset');
    super.updateElement(element, index, properties, mode);
  }

  _getPatchedDataset() {
    const dataset = super.getDataset();
    return Object.assign(
      {},
      {
        dataset,
        // inline d.v
        data: dataset.data.map((d) => (d != null && typeof d.y === 'number' ? d.y : d)),
      }
    );
  }

  _withPatching(f) {
    try {
      this.getDataset = this._getPatchedDataset.bind(this);
      return f();
    } finally {
      delete this.getDataset;
    }
  }

  countVisibleElements() {
    return this._withPatching(() => super.countVisibleElements());
  }

  _computeAngle(index) {
    return this._withPatching(() => super._computeAngle(index));
  }
}
PolarAreaWithErrorBars.id = 'polarAreaWithErrorBars';
PolarAreaWithErrorBars.defaults = helpers.merge({}, [defaults.polarArea, tooltipDefaults, animationHints]);
PolarAreaWithErrorBars.prototype.dataElementType = ArcWithErrorBar.register();
PolarAreaWithErrorBars.prototype.dataElementOptions = Object.assign(
  {},
  controllers.polarArea.prototype.dataElementOptions,
  styleObjectKeys
);

// const polarAreaWithErrorBars = {

// updateElement(arc, index, reset, ...args) {
//   this._withPatching(() => superClass.updateElement.call(this, arc, index, reset, ...args));

//   updateErrorBarElement(this, arc, index, reset);

//   calculateErrorBarValuesPixelsPolar(this, arc, arc._model, index, reset);
// },
