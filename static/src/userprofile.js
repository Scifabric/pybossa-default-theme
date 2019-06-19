'use strict';

import Vue from 'vue';
import RecentlyCompletedTasks from './components/userprofile/recently_completed_tasks';

const app = new Vue({
  el: '#userprofile',
  components: {
    RecentlyCompletedTasks
  }
});

export default app;
