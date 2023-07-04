---
title: Line TimeSeries With Error Bars
---

# Line TimeSeries With Error Bars

<script setup>
import {config} from './lineTime';
</script>

<LineWithErrorBarsChart
  :options="config.options"
  :data="config.data"
/>

### Code

<<< ./lineTime.ts#config
