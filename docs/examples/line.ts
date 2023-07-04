import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region config
export const config: ChartConfiguration<'lineWithErrorBars'> = {
  type: 'lineWithErrorBars',
  data: {
    labels: ['A', 'B'],
    datasets: [
      {
        data: [
          {
            y: 4,
            yMin: 1,
            yMax: 6,
          },
          {
            y: 2,
            yMin: 1,
            yMax: 4,
          },
        ],
      },
    ],
  },
};
// #endregion config
