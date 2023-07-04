import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region config
export const config: ChartConfiguration<'polarAreaWithErrorBars'> = {
  type: 'polarAreaWithErrorBars',
  data: {
    labels: ['A', 'B'],
    datasets: [
      {
        data: [
          {
            r: 4,
            rMin: 1,
            rMax: 6,
          },
          {
            r: 2,
            rMin: 1,
            rMax: 4,
          },
        ],
      },
    ],
  },
};
// #endregion config
