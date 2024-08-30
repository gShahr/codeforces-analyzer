import { updateContestChart, updateUserChart } from './chart.js';

(function() {
  'use strict';

  function draw() {
      let pathname = window.location.pathname;
      let handle = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
      updateContestChart(handle);
      updateUserChart(handle);
  }

  draw();  
})();