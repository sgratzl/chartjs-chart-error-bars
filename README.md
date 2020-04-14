# Chart.js Error Bars
[![License: MIT][mit-image]][mit-url] [![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting error bars plots. This plugin extends the several char types (`bar`, `horizontalBar`, `line`, `scatter`, `polarArea`)
with their error bar equivalent (`barWithErrorBars`, `horizontalBarWithErrorBars`, `lineWithErrorBars`, `scatterWithErrorBars`, `polarAreaWithErrorBars`). In addition, it comes with equivalents for scales (`linearWithErrorBars`, `logarithmicWithErrorBars`, `radialLinearWithErrorBars`) that consider the error bars when computing the data limits.

**Works only with Chart.js >= 2.8.0**

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


## Install

```bash
npm install --save chart.js chartjs-chart-error-bars
```

## Usage
see [Samples](https://github.com/sgratzl/chartjs-chart-error-bars/tree/master/samples) on Github

and [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/TODO)


## Styling
Several new styling keys are added to the indiviual chart types

```typescript
interface IErrorBarStyling {
  /**
   * line width of the center line
   * @default 1
   * @scriptable
   */
  errorBarLineWidth: number;
  /**
   * color of the center line
   * @default '#2c2c2c'
   * @scriptable
   */
  errorBarColor: string;
  /**
   * line width of the whisker lines
   * @default 1
   * @scriptable
   */
  errorBarWhiskerLineWidth: number;
  /**
   * width of the whiskers in relation to the bar width, use `0` to force a fixed with, see below
   * @default 0.2
   * @scriptable
   */
  errorBarWhiskerRatio: number;
  /**
   * pixel width of the whiskers for non bar chart cases
   * @default 20
   * @scriptable
   */
  errorBarWhiskerSize: number;
  /**
   * color of the whisker lines
   * @default '#2c2c2c'
   * @scriptable
   */
  errorBarWhiskerColor: string;
}
```

## Data structure

The data structure depends on the chart type. It uses the fact that chart.js is supporting scatterplot. Thus, it is already prepared for object values.

### Chart types: `bar`, `line`, `scatter`, `polarArea`

```typescript
interface IErrorBarItem {
  /**
   * the actual value
   */
  y: number;
  /**
   * the minimal absolute error bar value
   */
  yMin: number;
  /**
   * the maximal absolute error bar value
   */
  yMax: number;
}
```

### Chart type: `horizontalBar`

```typescript
interface IErrorBarItem {
  /**
   * the actual value
   */
  x: number;
  /**
   * the minimal absolute error bar value
   */
  xMin: number;
  /**
   * the maximal absolute error bar value
   */
  xMax: number;
}
```

### Chart type: `scatter`

```typescript
interface IErrorBarItem {
  /**
   * the actual x value
   */
  x: number;
  /**
   * the minimal absolute error bar x value
   */
  xMin: number;
  /**
   * the maximal absolute error bar x value
   */
  xMax: number;
  /**
   * the actual y value
   */
  y: number;
  /**
   * the minimal absolute error bar y value
   */
  yMin: number;
  /**
   * the maximal absolute error bar y value
   */
  yMax: number;
}
```

## Multiple Error Bars

Multiple error bars are supported.

![multiple error bars](https://user-images.githubusercontent.com/4129778/65359671-3d039600-dbcb-11e9-905e-1dd22b5e8783.png)


### Styling

The styling options support different array version.

**Note**: as with other chart.js style options, using an array will be one value per dataset. Thus, to specify the values for different error bars, one needs to wrap it in another array. The outer for the dataset, the inner for the error bars.

```typescript
interface IErrorBarStyling {
  /**
   * line width of the center line
   * @default [[1, 3]]
   * @scriptable
   */
  errorBarLineWidth: number[][];
  /**
   * color of the center line
   * @default [['#2c2c2c', '#1f1f1f']]
   * @scriptable
   */
  errorBarColor: string[][];
  /**
   * line width of the whisker lines
   * @default [[1, 3]]
   * @scriptable
   */
  errorBarWhiskerLineWidth: number[][];
  /**
   * width of the whiskers in relation to the bar width, use `0` to force a fixed with, see below
   * @default [[0.2, 0.25]]
   * @scriptable
   */
  errorBarWhiskerRatio: number[][];
  /**
   * pixel width of the whiskers for non bar chart cases
   * @default [[20, 24]]
   * @scriptable
   */
  errorBarWhiskerSize: number[][];
  /**
   * color of the whisker lines
   * @default [['#2c2c2c', '#1f1f1f']]
   * @scriptable
   */
  errorBarWhiskerColor: string[][];
}
```

### Data structure

Just use array of numbers for the corresponding data structures attributes (`xMin`, `xMax`, `yMin`, `yMax`). The error bars will be rendered in reversed order. Thus, by convention the most inner error bar is in the first place.

e.g.
```typescript
{
  y: 4,
  yMin: [2, 1],
  yMax: [5, 6]
}
```


## Building

```sh
npm install
npm run build
```

[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[npm-image]: https://badge.fury.io/js/chartjs-chart-error-bars.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-error-bars
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-error-bars/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-error-bars/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
