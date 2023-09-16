---
title: Bar With Multiple Error Bars
---

# Bar With Multiple Error Bars

<script setup>
import {config as bar} from './multibar';
</script>

<BarWithErrorBarsChart
  :options="bar.options"
  :data="bar.data"
/>

### Code

<<< ./multibar.ts#config
