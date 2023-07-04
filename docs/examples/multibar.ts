import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region config
export const config: ChartConfiguration<'barWithErrorBars'> = {
  type: 'barWithErrorBars',
  data: {
    labels: ['A', 'B'],
    datasets: [
      {
        data: [
          {
            y: 4,
            yMin: [2, 1],
            yMax: [5, 6],
          },
          {
            y: 2,
            yMin: [1, 0],
            yMax: [3, 7],
          },
        ],
      },
    ],
  },
};
// #endregion config
