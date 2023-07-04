import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region bar
export const bar: ChartConfiguration<'barWithErrorBars'> = {
  type: 'barWithErrorBars',
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
// #endregion bar

// #region scatter
export const scatter: ChartConfiguration<'scatterWithErrorBars'> = {
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
// #endregion scatter
