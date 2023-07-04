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
            x: 4,
            xMin: 1,
            xMax: 6,
          },
          {
            x: 2,
            xMin: 1,
            xMax: 4,
          },
        ],
      },
    ],
  },
  options: {
    indexAxis: 'y',
  },
};
// #endregion config
