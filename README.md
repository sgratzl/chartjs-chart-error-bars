# Chart.js Error Bars
[![NPM Package][npm-image]][npm-url] [![CircleCI][circleci-image]][circleci-url]

Chart.js module for charting error bars plots. This plugin extends the several char types (`bar`, `horizontalBar`, `line`, `scatter`, `polarArea`)
with their error bar equivalent ( (`barWithErrorBars`, `horizontalBarWithErrorBars`, `lineWithErrorBars`, `scatterWithErrorBars`, `polarAreaWithErrorBars`)).

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

and [CodePen]()

## Chart


## Styling
Several new styling keys are added to the indiviual chart types

```typescript
interface IErrorBarStyling {

}
```

## Data structure

```typescript
interface IErrorBarItem {

}
```

## Building

```sh
npm install
npm run build
```

[npm-image]: https://badge.fury.io/js/chartjs-chart-error-bars.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-error-bars
[circleci-image]: https://circleci.com/gh/sgratzl/chartjs-chart-error-bars.svg?style=shield
[circleci-url]: https://circleci.com/gh/sgratzl/chartjs-chart-error-bars
