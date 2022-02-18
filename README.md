# Chart.js Error Bars

[![License: MIT][mit-image]][mit-url] [![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting error bars plots. This plugin extends the several char types (`bar`, `horizontalBar`, `line`, `scatter`, `polarArea`)
with their error bar equivalent (`barWithErrorBars`, `lineWithErrorBars`, `scatterWithErrorBars`, `polarAreaWithErrorBars`).

Bar Chart

![bar char with error bars](https://user-images.githubusercontent.com/4129778/65203797-1a9e3b00-da5a-11e9-9de7-9cbcf75dfeda.png)

Horizontal Bar Chart

![horizontal bar chart with error bars](https://user-images.githubusercontent.com/4129778/65203796-1a9e3b00-da5a-11e9-9c43-db503679178c.png)

Line Chart

![line chart with error bars](https://user-images.githubusercontent.com/4129778/65203795-1a05a480-da5a-11e9-98fa-05440371485f.png)

Scatterplot

![scatter plot with error bars](https://user-images.githubusercontent.com/4129778/65203792-1a05a480-da5a-11e9-9073-6e849d42af64.png)

Polar Area plot

![polar area plot with error bars](https://user-images.githubusercontent.com/4129778/65203794-1a05a480-da5a-11e9-9b17-316ecc6ae0d9.png)

## Related Plugins

Check out also my other chart.js plugins:

- [chartjs-chart-boxplot](https://github.com/sgratzl/chartjs-chart-boxplot) for rendering boxplots and violin plots
- [chartjs-chart-geo](https://github.com/sgratzl/chartjs-chart-geo) for rendering map, bubble maps, and choropleth charts
- [chartjs-chart-graph](https://github.com/sgratzl/chartjs-chart-graph) for rendering graphs, trees, and networks
- [chartjs-chart-pcp](https://github.com/sgratzl/chartjs-chart-pcp) for rendering parallel coordinate plots
- [chartjs-chart-venn](https://github.com/sgratzl/chartjs-chart-venn) for rendering venn and euler diagrams
- [chartjs-chart-wordcloud](https://github.com/sgratzl/chartjs-chart-wordcloud) for rendering word clouds
- [chartjs-plugin-hierarchical](https://github.com/sgratzl/chartjs-plugin-hierarchical) for rendering hierarchical categorical axes which can be expanded and collapsed

## Install

```bash
npm install --save chart.js chartjs-chart-error-bars
```

## Usage

see [Samples](https://github.com/sgratzl/chartjs-chart-error-bars/tree/master/samples) on Github

and [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/ZEbqmqx)

## Styling

Several new styling keys are added to the individual chart types

## Data structure

The data structure depends on the chart type. It uses the fact that chart.js is supporting scatterplots. Thus, it is already prepared for object values.

### Chart types: `bar` and `line`

see TypeScript Interface:

[IErrorBarXDataPoint](https://github.com/sgratzl/chartjs-chart-error-bars/blob/main/src/controllers/base.ts#L3-L16)

### Chart type: `bar` with `indexAxis: 'y'`

[IErrorBarYDataPoint](https://github.com/sgratzl/chartjs-chart-error-bars/blob/main/src/controllers/base.ts#L18-L31)

### Chart type: `scatter`

a combination of the previous two ones

[IErrorBarXDataPoint](https://github.com/sgratzl/chartjs-chart-error-bars/blob/main/src/controllers/base.ts#L3-L16)

and

[IErrorBarYDataPoint](https://github.com/sgratzl/chartjs-chart-error-bars/blob/main/src/controllers/base.ts#L18-L31)

### Chart type: `polarArea`

[IErrorBarRDataPoint](https://github.com/sgratzl/chartjs-chart-error-bars/blob/main/src/controllers/base.ts#L33-L46)

## Multiple Error Bars

Multiple error bars are supported.

![multiple error bars](https://user-images.githubusercontent.com/4129778/65359671-3d039600-dbcb-11e9-905e-1dd22b5e8783.png)

### Styling

The styling options support different array version.

**Note**: as with other chart.js style options, using an array will be one value per dataset. Thus, to specify the values for different error bars, one needs to wrap it in an object with a `v` key having the value itself. The outer for the dataset, the inner for the error bars.

see TypeScript interface:

[IErrorBarOptions](https://github.com/sgratzl/chartjs-chart-error-bars/blob/main/src/elements/render.ts#L17-L54)

### Data structure

Just use array of numbers for the corresponding data structures attributes (`xMin`, `xMax`, `yMin`, `yMax`). The error bars will be rendered in reversed order. Thus, by convention the most inner error bar is in the first place.

e.g.

```ts
{
  y: 4,
  yMin: [2, 1],
  yMax: [5, 6]
}
```

### ESM and Tree Shaking

The ESM build of the library supports tree shaking thus having no side effects. As a consequence the chart.js library won't be automatically manipulated nor new controllers automatically registered. One has to manually import and register them.

Variant A:

```js
import Chart, { LinearScale, CategoryScale } from 'chart.js';
import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars';

// register controller in chart.js and ensure the defaults are set
Chart.register(BarWithErrorBarsController, BarWithErrorBar, LinearScale, CategoryScale);

const chart = new Chart(document.getElementById('canvas').getContext('2d'), {
  type: BarWithErrorBarsController.id,
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
});
```

Variant B:

```js
import { BarWithErrorBarsChart } from 'chartjs-chart-error-bars';

const chart = new BarWithErrorBarsChart(document.getElementById('canvas').getContext('2d'), {
  data: {
    //...
  },
});
```

## Development Environment

```sh
npm i -g yarn
yarn install
yarn sdks vscode
```

### Building

```sh
yarn install
yarn build
```

[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[npm-image]: https://badge.fury.io/js/chartjs-chart-error-bars.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-error-bars
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-error-bars/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-error-bars/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
