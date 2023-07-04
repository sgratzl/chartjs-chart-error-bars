import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region config
export const config: ChartConfiguration<'scatterWithErrorBars'> = {
  type: 'scatterWithErrorBars',
  data: {
    labels: ['A', 'B'],
    datasets: [
      {
        data: [
          {
            x: 2,
            xMin: 1,
            xMax: 3,
            y: 4,
            yMin: 1,
            yMax: 6,
          },
          {
            x: 7,
            xMin: 6,
            xMax: 9,
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
