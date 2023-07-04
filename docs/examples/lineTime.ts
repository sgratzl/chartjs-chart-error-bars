import type { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-date-fns';
import type {} from '../../src';

// #region config
export const config: ChartConfiguration<'lineWithErrorBars'> = {
  type: 'lineWithErrorBars',
  data: {
    datasets: [
      {
        data: [
          {
            x: '2016-12-25',
            y: 4,
            yMin: 1,
            yMax: 6,
          },
          {
            x: '2017-12-25',
            y: 6,
            yMin: 2,
            yMax: 8,
          },
          {
            x: '2018-12-25',
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
      x: {
        type: 'time',
        // type: 'timeseries',
      },
    },
  },
};
// #endregion config
