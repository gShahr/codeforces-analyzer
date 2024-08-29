function getData(handle) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://codeforces.com/api/user.status?handle=' + handle, true);
    httpRequest.send();
    let res = { rating: {}, tags: {}, lang: {}, unsolved: {} };
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = JSON.parse(httpRequest.responseText);
            var result = json.result;
            var solved = {};
            var key;
            var contestId;
            var problemIndex;
            var problemId;
            for (key in result) {
                if (result[key].verdict === "OK") {
                    contestId = result[key].problem.contestId;
                    problemIndex = result[key].problem.index;
                    problemId = contestId + problemIndex;
                    if (problemId in solved) {
                        continue;
                    } else {
                        solved[problemId] = { contestId: contestId, problemIndex: problemIndex };
                    }
                    var rating = result[key].problem.rating;
                    var tags = result[key].problem.tags;
                    var lang = result[key].programmingLanguage;
                    if (rating in res.rating) {
                        res.rating[rating]++;
                    }
                    else {
                        res.rating[rating] = 1;
                    }
                    for (var key2 in tags) {
                        var tag = tags[key2];
                        if (tag in res.tags) {
                            res.tags[tag]++;
                        }
                        else {
                            res.tags[tag] = 1;
                        }
                    }
                    if (lang in res.lang) {
                        res.lang[lang]++;
                    } else {
                        res.lang[lang] = 1;
                    }
                }
            }
            for (key in result) {
                if (result[key].verdict !== "OK") {
                    contestId = result[key].problem.contestId;
                    problemIndex = result[key].problem.index;
                    problemId = contestId + problemIndex;
                    if (problemId in solved) { }
                    else {
                        res.unsolved[problemId] = { contestId: contestId, problemIndex: problemIndex };
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
        httpRequest.onreadystatechange = function() {
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