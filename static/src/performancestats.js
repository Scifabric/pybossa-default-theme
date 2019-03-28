'use strict';

import Vue from 'vue';
import PerformanceStats from './components/performancestats/index';

const app = new Vue({
  el: '#performancestats',
  components: {
    PerformanceStats
  }
});

export default app;
