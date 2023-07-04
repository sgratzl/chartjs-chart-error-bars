---
title: Line As Scatter With Error Bars
---

# Lien As Scatter With Error Bars

<script setup>
import {config} from './lineScatter';
</script>

<LineWithErrorBarsChart
  :options="config.options"
  :data="config.data"
/>

### Code

<<< ./lineScatter.ts#config
