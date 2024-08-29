function drawChart(res) {
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

function drawRatingChart(res) {
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
    var xData = [];
    var yData = [];
    xData = Object.keys(res.rating);
    for (key in xData) {
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

function drawTagsChart(res) {
    var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="tagsChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
    document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
    var chartDom = document.getElementById('tagsChart');
    var myChart = echarts.init(chartDom);
    var option;
    var data1 = [];
    var key;
    window.addEventListener('resize', function() {
        myChart.resize();
    });
    for (key in res.tags) {
        var tag = res.tags[key];
        data1.push({ value: tag, name: key });
    }
    data1.sort(function(nextValue, currentValue) {
        if (nextValue.value < currentValue.value)
            return 1;
        else if (nextValue.value > currentValue.value)
            return -1;
        return 0;
    });
    var data2 = [];
    for (key in data1) {
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
            formatter: function(name) {
                let singleData = option.series[0].data.filter(function(item) {
                    return item.name == name
                })
                return name + ' : ' + singleData[0].value;
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

function drawLangChart(res) {
    var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="langChart" style="height:400px;padding:2em 1em 0 1em;margin-top:1em;"></div>';
    document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
    var chartDom = document.getElementById('langChart');
    var myChart = echarts.init(chartDom);
    var option;
    var data1 = [];
    var key;
    window.addEventListener('resize', function() {
        myChart.resize();
    });
    for (key in res.lang) {
        var lang = res.lang[key];
        data1.push({ value: lang, name: key });
    }
    data1.sort(function(nextValue, currentValue) {
        if (nextValue.value < currentValue.value)
            return 1;
        else if (nextValue.value > currentValue.value)
            return -1;
        return 0;
    });
    var data2 = [];
    for (key in data1) {
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
            formatter: function(name) {
                let singleData = option.series[0].data.filter(function(item) {
                    return item.name == name
                })
                return name + ' : ' + singleData[0].value;
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

function drawUnsolvedChart(res) {
    var div = '<div class="roundbox userActivityRoundBox borderTopRound borderBottomRound" id="unsolvedChart" style="height:auto;padding:2em 1em 0 1em;margin-top:1em;"></div>';
    document.getElementById('pageContent').insertAdjacentHTML('beforeend', div);
    var toAdd1 = '<h4>Unsolved Problems(total:';
    var toAdd2 = ')</h4>';
    var key;
    var total = 0;
    for (key in res.unsolved) {
        var contestId = res.unsolved[key].contestId;
        var problemIndex = res.unsolved[key].problemIndex;
        if (total % 5 == 0) toAdd2 += '<br/>';
        total++;
        if (contestId < 10000) {
            toAdd2 += '<a href="' + 'https://codeforces.com/problemset/problem/' + contestId + '/' + problemIndex + '' + '">' + key + '<\a>' + '&nbsp;';
        }
        else {
            toAdd2 += '<a href="' + 'https://codeforces.com/problemset/gymProblem/' + contestId + '/' + problemIndex + '' + '">' + key + '<\a>' + '&nbsp;';
        }
    }
    document.getElementById('unsolvedChart').insertAdjacentHTML('beforeend', toAdd1 + total + toAdd2);
}