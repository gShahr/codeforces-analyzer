// ==UserScript==
// @name         Codeforces Analyzer
// @namespace    https://codeforces.com/profile/gshahrouzi
// @version      2.0
// @description  The Codeforces Analyzer is designed to provide insights into your problem-solving patterns on Codeforces
// @author       gShahr
// @match        https://codeforces.com/profile/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465176/CF%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/465176/CF%E8%A7%A3%E9%A2%98%E6%95%B0%E6%8D%AE%E5%8F%AF%E8%A7%86%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function drawChart(res){
      drawRatingChart(res);
      drawTagsChart(res);
      drawLangChart(res);
      drawUnsolvedChart(res);
    }

    function drawContestChart(ret) {
      var container = document.createElement('div');
      container.className = 'info-box';
      container.innerHTML = `
          <div class="info-item">Best: ${ret.best}</div>
          <div class="info-item">Worst: ${ret.worst}</div>
          <div class="info-item">Max Up: ${ret.maxUp}</div>
          <div class="info-item">Max Down: ${ret.maxDown}</div>
          <div class="info-item">Best Contest: ${ret.bestCon}</div>
          <div class="info-item">Worst Contest: ${ret.worstCon}</div>
          <div class="info-item">Max Up Contest: ${ret.maxUpCon}</div>
          <div class="info-item">Max Down Contest: ${ret.maxDownCon}</div>
          <div class="info-item">Max Rating: ${ret.maxRating}</div>
          <div class="info-item">Min Rating: ${ret.minRating}</div>
          <div class="info-item">Rating: ${ret.rating}</div>
      `;
      document.getElementById('pageContent').appendChild(container);
    }
  
    function drawRatingChart(res){
        var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="ratingChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;position:relative;"></div>';
        document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
        var chartDom = document.getElementById('ratingChart');
        var myChart = echarts.init(chartDom);
        var inputBox = '<input type="text" id="chartInput" placeholder="Type and press Enter" style="position:absolute; top:0; left:0; width:100%; padding:0.5em; z-index:10;">';
        chartDom.insertAdjacentHTML('afterbegin', inputBox);
        document.getElementById('chartInput').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                handleInput(event.target.value, myChart);
            }
        });
        var option;
        var key;
        window.addEventListener('resize', function() {
          myChart.resize();
        });
        var xData=[];
        var yData=[];
        xData=Object.keys(res.rating);
        for(key in xData){
            yData.push(res.rating[xData[key]]);
        }
        option = {
          title: {
            text: 'Problem Ratings',
            left: 'center'
          },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: xData,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: 'solved',
                  type: 'bar',
                  barWidth: '30%',
                  data: yData
                }
              ]
        };
        option && myChart.setOption(option);
    }

    function testing(handle, callback, errorCallback) {
      let httpRequest = new XMLHttpRequest();
      var res={rating:{},tags:{},lang:{},unsolved:{}};
      httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
              var json=JSON.parse(httpRequest.responseText);
              var result=json.result;
              var solved={};
              var key;
              var contestId;
              var problemIndex;
              var problemId;
              for(key in result){
                  if(result[key].verdict==="OK"){
                      contestId=result[key].problem.contestId;
                      problemIndex=result[key].problem.index;
                      problemId=contestId+problemIndex;
                      if(problemId in solved){
                          continue;
                      } else{
                        solved[problemId]={contestId:contestId,problemIndex:problemIndex};
                      }
                      var rating=result[key].problem.rating;
                      var tags=result[key].problem.tags;
                      var lang=result[key].programmingLanguage;
                      if(rating in res.rating){
                          res.rating[rating]++;
                      }
                      else{
                          res.rating[rating]=1;
                      }
                      for(var key2 in tags){
                        var tag=tags[key2];
                        if(tag in res.tags){
                          res.tags[tag]++;
                        }
                        else{
                          res.tags[tag]=1;
                        }
                      }
                      if(lang in res.lang){
                        res.lang[lang]++;
                      }else{
                        res.lang[lang]=1;
                      }
                  }
              }
              for(key in result){
                if(result[key].verdict!=="OK"){
                  contestId=result[key].problem.contestId;
                  problemIndex=result[key].problem.index;
                  problemId=contestId+problemIndex;
                  if(problemId in solved){}
                  else{
                    res.unsolved[problemId]={contestId:contestId,problemIndex:problemIndex};
                  }
                }
              }
                  callback(res);
              } else {
                  errorCallback(`Error: ${httpRequest.status} - ${httpRequest.statusText}`);
              }
          }
  
      httpRequest.onerror = function () {
          errorCallback('Network Error');
      };
  
      httpRequest.ontimeout = function () {
          errorCallback('Request Timed Out');
      };
  
      httpRequest.open('GET', 'https://codeforces.com/api/user.status?handle=' + handle, true);
      httpRequest.timeout = 5000; // Set timeout to 5 seconds
      httpRequest.send();
  }

    function handleInput(value, chart) {
      console.log('User input:', value);
      testing(value, function (processedData) {
          updateChart(chart, processedData);
          console.log(processedData);
      }, function (error) {
          console.error(error);
      });
    }

    function updateChart(chart, res) {
      var key;
      var xData=[];
      var yData=[];
      xData=Object.keys(res.rating);
      for(key in xData){
          yData.push(res.rating[xData[key]]);
      }
      var option = chart.getOption();
      var newSeries = {
        name: 'solved',
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
          color: '#ff0000'
        },
        data: yData
      };
      option.series.push(newSeries);
      chart.setOption(option);
    }

  function drawTagsChart(res){
      var div='<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="tagsChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
      document.getElementById('pageContent').insertAdjacentHTML('beforeend',div);
      var chartDom = document.getElementById('tagsChart');
      var myChart = echarts.init(chartDom);
      var option;
      var data1=[];
      var key;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
      for(key in res.tags){
        var tag=res.tags[key];
        data1.push({value:tag,name:key});
      }
      data1.sort(function(nextValue,currentValue){
        if(nextValue.value<currentValue.value)
          return 1;
        else if(nextValue.value>currentValue.value)
          return -1;
        return 0;
      });
      var data2=[];
      for(key in data1){
        data2.push(data1[key].name);
      }
      option = {
        title: {
          text: 'Tags Solved',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data2,
          formatter:function(name){
              let singleData = option.series[0].data.filter(function(item){
                  return item.name == name
              })
              return  name + ' : ' + singleData[0].value;
          },
        },
        series: [
          {
            name: 'tag',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data1,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
  
      option && myChart.setOption(option);
    }
  
    function drawLangChart(res){
      var div='<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="langChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
      document.getElementById('pageContent').insertAdjacentHTML('beforeend',div);
      var chartDom = document.getElementById('langChart');
      var myChart = echarts.init(chartDom);
      var option;
      var data1=[];
      var key;
      window.addEventListener('resize', function() {
        myChart.resize();
      });
      for(key in res.lang){
        var lang=res.lang[key];
        data1.push({value:lang,name:key});
      }
      data1.sort(function(nextValue,currentValue){
        if(nextValue.value<currentValue.value)
          return 1;
        else if(nextValue.value>currentValue.value)
          return -1;
        return 0;
      });
      var data2=[];
      for(key in data1){
        data2.push(data1[key].name);
      }
      option = {
        title: {
          text: 'Programming Language',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data2,
          formatter:function(name){
            let singleData = option.series[0].data.filter(function(item){
                return item.name == name
            })
            return  name + ' : ' + singleData[0].value;
          },
        },
        series: [
          {
            name: 'lang',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data1,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
  
      option && myChart.setOption(option);
    }
  
    function drawUnsolvedChart(res){
      var div='<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="unsolvedChart" style="height:auto;padding:2em 1em 0 1em;margin-top:1em;"></div>';
      document.getElementById('pageContent').insertAdjacentHTML('beforeend',div);
      var toAdd1='<h4>Unsolved Problems(total:';
      var toAdd2=')</h4>';
      var key;
      var total=0;
      for(key in res.unsolved){
        var contestId=res.unsolved[key].contestId;
        var problemIndex=res.unsolved[key].problemIndex;
        if(total%5==0)toAdd2+='<br/>';
        total++;
        if(contestId<10000){
          toAdd2+='<a href="'+'https://codeforces.com/problemset/problem/'+contestId+'/'+problemIndex+''+'">'+key+'<\a>'+'&nbsp;';
        }
        else{
          toAdd2+='<a href="'+'https://codeforces.com/problemset/gymProblem/'+contestId+'/'+problemIndex+''+'">'+key+'<\a>'+'&nbsp;';
        }
      }
      document.getElementById('unsolvedChart').insertAdjacentHTML('beforeend',toAdd1+total+toAdd2);
    }

    function getData(handle) {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', 'https://codeforces.com/api/user.status?handle='+handle, true);
      httpRequest.send();
      let res={rating:{},tags:{},lang:{},unsolved:{}};
      httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json=JSON.parse(httpRequest.responseText);
            var result=json.result;
            var solved={};
            var key;
            var contestId;
            var problemIndex;
            var problemId;
            for(key in result){
                if(result[key].verdict==="OK"){
                    contestId=result[key].problem.contestId;
                    problemIndex=result[key].problem.index;
                    problemId=contestId+problemIndex;
                    if(problemId in solved){
                        continue;
                    } else{
                      solved[problemId]={contestId:contestId,problemIndex:problemIndex};
                    }
                    var rating=result[key].problem.rating;
                    var tags=result[key].problem.tags;
                    var lang=result[key].programmingLanguage;
                    if(rating in res.rating){
                        res.rating[rating]++;
                    }
                    else{
                        res.rating[rating]=1;
                    }
                    for(var key2 in tags){
                      var tag=tags[key2];
                      if(tag in res.tags){
                        res.tags[tag]++;
                      }
                      else{
                        res.tags[tag]=1;
                      }
                    }
                    if(lang in res.lang){
                      res.lang[lang]++;
                    }else{
                      res.lang[lang]=1;
                    }
                }
            }
            for(key in result){
              if(result[key].verdict!=="OK"){
                contestId=result[key].problem.contestId;
                problemIndex=result[key].problem.index;
                problemId=contestId+problemIndex;
                if(problemId in solved){}
                else{
                  res.unsolved[problemId]={contestId:contestId,problemIndex:problemIndex};
                }
              }
            }
            drawChart(res);
          }
        }
    }

    async function getContestData(handle) {
      return new Promise((resolve, reject) => {
          let httpRequest = new XMLHttpRequest();
          httpRequest.open('GET', 'https://codeforces.com/api/user.rating?handle=' + handle, true);
          httpRequest.send();
          httpRequest.onreadystatechange = function () {
              if (httpRequest.readyState == 4) {
                  if (httpRequest.status == 200) {
                      let res = getContestStat(JSON.parse(httpRequest.responseText));
                      resolve(res);
                  } else {
                      reject(new Error('Request failed with status ' + httpRequest.status));
                  }
              }
          };
      });
    }

    function getContestStat(data) {
      let ret = {};
      ret.best = 1e10;
      ret.worst = -1e10;
      ret.maxUp = 0;
      ret.maxDown = 0;
      ret.bestCon = '';
      ret.worstCon = '';
      ret.maxUpCon = '';
      ret.maxDownCon = '';
      ret.maxRating = 0;
      ret.minRating = 1e10;
      ret.rating = 0;
      ret.tot = data.result.length;
      ret.timeline = [];
      ret.all = {};
    
      for (var i = 0; i < data.result.length; i++) {
        var con = data.result[i];
        ret.all[con.contestId] = [con.contestName, con.rank];
        if (con.rank < ret.best) {
          ret.best = con.rank;
          ret.bestCon = con.contestId;
        }
        if (con.rank > ret.worst) {
          ret.worst = con.rank;
          ret.worstCon = con.contestId;
        }
        var ch = con.newRating - con.oldRating;
        if (ch > ret.maxUp) {
          ret.maxUp = ch;
          ret.maxUpCon = con.contestId;
        }
        if (ch < ret.maxDown) {
          ret.maxDown = ch;
          ret.maxDownCon = con.contestId;
        }
    
        ret.maxRating = Math.max(ret.maxRating, con.newRating);
        ret.minRating = Math.min(ret.minRating, con.newRating);
    
        if (i == data.result.length - 1) ret.rating = con.newRating;
    
        ret.timeline.push([con.ratingUpdateTimeSeconds, con.newRating]);
      }
      return ret;
    }    

    function draw() {
        let pathname = window.location.pathname;
        let handle = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
        getData(handle);
    }

    async function fetchContestData(handle) {
      try {
          return await getContestData(handle);
      } catch (error) {
          console.error('Error fetching contest data:', error);
      }
    }
    async function drawContestChartWithData(handle) {
      const data = await fetchContestData(handle);
      drawContestChart(data);
    }

    let pathname = window.location.pathname;
    let handle = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
    drawContestChartWithData(handle);
    draw();  
})();