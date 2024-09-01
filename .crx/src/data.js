async function getUserStatusData(handle) {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://codeforces.com/api/user.status?handle=' + handle, true);
        httpRequest.send();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4) {
                if (httpRequest.status == 200) {
                    let res = processUserStatusData(JSON.parse(httpRequest.responseText));
                    resolve(res);
                } else {
                    reject(new Error('Request failed with status ' + httpRequest.status));
                }
            }
        };
    });
}

function processUserStatusData(data) {
    let res = { rating: {}, tags: {}, lang: {}, unsolved: {} };
    let solved = {};
    let result = data.result;

    for (let key in result) {
        if (result[key].verdict === "OK") {
            let contestId = result[key].problem.contestId;
            let problemIndex = result[key].problem.index;
            let problemId = contestId + problemIndex;

            if (!(problemId in solved)) {
                solved[problemId] = { contestId: contestId, problemIndex: problemIndex };

                let rating = result[key].problem.rating;
                let tags = result[key].problem.tags;
                let lang = result[key].programmingLanguage;

                res.rating[rating] = (res.rating[rating] || 0) + 1;

                for (let tag of tags) {
                    res.tags[tag] = (res.tags[tag] || 0) + 1;
                }

                res.lang[lang] = (res.lang[lang] || 0) + 1;
            }
        }
    }
    for (let key in result) {
        if (result[key].verdict !== "OK") {
            let contestId = result[key].problem.contestId;
            let problemIndex = result[key].problem.index;
            let problemId = contestId + problemIndex;

            if (!(problemId in solved)) {
                res.unsolved[problemId] = { contestId: contestId, problemIndex: problemIndex };
            }
        }
    }
    return res;
}

async function updateUserChart(handle) {
    try {
        const data = await getUserStatusData(handle);
        drawChart(data);
    } catch (error) {
        console.error('Error fetching user status data:', error);
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

async function updateContestChart(handle) {
    try {
        const data = await getContestData(handle);
        drawContestChart(data);
    } catch (error) {
        console.error('Error fetching contest data:', error);
    }
}