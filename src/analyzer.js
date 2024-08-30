// ==UserScript==
// @name         Codeforces Analyzer
// @namespace    https://codeforces.com/profile/gshahrouzi
// @version      2.0
// @description  The Codeforces Analyzer is designed to provide insights into your problem-solving patterns on Codeforces
// @author       gShahr
// @match        https://codeforces.com/profile/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js?v=1.0
// @require      https://raw.githubusercontent.com/gShahr/codeforces-analyzer/main/src/data.js?v=1.0
// @require      https://raw.githubusercontent.com/gShahr/codeforces-analyzer/main/src/chart.js?v=1.0
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/465176/CF%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96.user.js
// @updateURL    https://update.greasyfork.org/scripts/465176/CF%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96.meta.js
// ==/UserScript==

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