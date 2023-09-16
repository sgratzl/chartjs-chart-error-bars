---
title: Bar With Error Bars
---

# Bar With Error Bars

<script setup>
import {config as bar} from './bar';
</script>

<BarWithErrorBarsChart
  :options="bar.options"
  :data="bar.data"
/>

### Code

<<< ./bar.ts#config
