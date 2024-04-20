const express = require("express");
const {processQueryResult} = require("../utils");
const router = express.Router();

const createRuns = (runs, stops) => {
    const groupedRunID = stops.reduce((result, item) => {
        (result[item['runID']] = result[item['runID']] || []).push(item);
        return result;
    }, {});
    for (const run of runs) {
        run.stops = groupedRunID[run.runID];
        console.info(runs);
    }
    return runs;
}

router.get('/:date', (req, res) => {
    const date = req.params.date;
    const parsed = Date.parse(date);
    if (isNaN(parsed)) {
        console.error('Invalid date');
        return res.status(400).json({message: 'Please provide a valid date'});
    }

    req.db.raw(`SELECT * FROM runs WHERE date = ?`, [date])
        .then(processQueryResult)
        .then(runsResult => {
            console.info(runsResult);
            const runIDs = runsResult.map(run => run.runID);
            console.info(runIDs);
            req.db.raw(`SELECT * FROM run_stops WHERE runID in (` + runIDs.map((_) => '?').join(',') + `)`, runIDs)
                .then(processQueryResult)
                .then(stopsResult => {
                    console.info(stopsResult);
                    const t = createRuns(runsResult, stopsResult);
                    return res.status(200).json(t);
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

module.exports = router;