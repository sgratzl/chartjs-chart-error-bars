import Theme from 'vitepress/theme';
import { createTypedChart } from 'vue-chartjs';
import {
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  Tooltip,
  Colors,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  TimeScale,
} from 'chart.js';
import {
  ArcWithErrorBar,
  BarWithErrorBar,
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  PointWithErrorBar,
  ScatterWithErrorBarsController,
} from '../../../src';

export default {
  ...Theme,
  enhanceApp({ app }) {
    const deps = [
      LinearScale,
      CategoryScale,
      RadialLinearScale,
      TimeScale,
      ArcWithErrorBar,
      BarWithErrorBar,
      BarWithErrorBarsController,
      LineWithErrorBarsController,
      PolarAreaWithErrorBarsController,
      PointWithErrorBar,
      ScatterWithErrorBarsController,
      Tooltip,
      Colors,
      BarElement,
      LineElement,
      PointElement,
      BarController,
      LineController,
    ];
    app.component('BarWithErrorBarsChart', createTypedChart('barWithErrorBars', deps));
    app.component('LineWithErrorBarsChart', createTypedChart('lineWithErrorBars', deps));
    app.component('PolarAreaWithErrorBarsChart', createTypedChart('polarAreaWithErrorBars', deps));
    app.component('ScatterWithErrorBarsChart', createTypedChart('scatterWithErrorBars', deps));
  },
};
