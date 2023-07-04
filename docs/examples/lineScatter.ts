import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region config
export const config: ChartConfiguration<'lineWithErrorBars'> = {
  type: 'lineWithErrorBars',
  data: {
    datasets: [
      {
        data: [
          {
            x: 1,
            y: 4,
            yMin: 1,
            yMax: 6,
          },
          {
            x: 0.5,
            y: 2,
            yMin: 1,
            yMax: 4,
          },
          {
            x: 3,
            y: 2,
            yMin: 1,
            yMax: 4,
          },
        ],
      },
    ],
  },
  options: {
    scales: {
      // x: {
      //   type: 'category',
      //   labels: ['A', 'B']
      // },
      x: { type: 'linear' },
    },
  },
};
// #endregion config
