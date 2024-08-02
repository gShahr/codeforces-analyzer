// ==UserScript==
// @name         CF解题数据可视化
// @name:en      codeforces analytics
// @namespace    https://codeforces.com/profile/tongwentao
// @version      1.5.1
// @description  显示某人Codeforces每个难度过了多少题，每个标签占比，喜欢用什么语言过题，有什么题试过了但是没有通过。
// @description:en Analyse Codeforces profiles
// @author       tongwentao
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
  
    function drawRatingChart(res){
        var div='<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="ratingChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
        document.getElementById('pageContent').insertAdjacentHTML('beforeend',div);
        var chartDom = document.getElementById('ratingChart');
        var myChart = echarts.init(chartDom);
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
                  barWidth: '60%',
                  data: yData
                }
              ]
        };
  
        option && myChart.setOption(option);
  
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
  
    var pathname = window.location.pathname;
    var handle = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
    var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://codeforces.com/api/user.status?handle='+handle, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json=JSON.parse(httpRequest.responseText);
                var result=json.result;
                var res={rating:{},tags:{},lang:{},unsolved:{}};
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
                console.log(res);
                drawChart(res);
            }
        };
  })();