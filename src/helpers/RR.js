import chroma from 'chroma-js'; // Import chroma-js for color manipulation

function scheduleJobs(tasksData, maxTime, timeQuantum) {
    const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(tasksData.length);

    let jobsQueue = []
    let allJobs = []
    let taskIndex = 0;
    for (const task of tasksData) {
        let currTime = task.releaseTime;
        let currDeadLine = task.deadLine;
        let jobsCounter = 1;
        let colory = task.color;
        while (currTime <= maxTime) {
            allJobs.push({ taskid: task.taskid, jobid: jobsCounter, releaseTime: currTime, period: task.period, executionTime: task.executionTime, deadLine: currDeadLine, priority: task.priority, color: colory == undefined ? colorScale[taskIndex] : colory })
            currTime += task.period;
            currDeadLine += task.period;
            jobsCounter++;
        }
        taskIndex++;
    }
    if (tasksData[0].jobid !== undefined) {
        allJobs = tasksData;
    }
    allJobs.sort((a, b) => a.releaseTime - b.releaseTime);
    console.log("*********************************************")
    for (const joby of allJobs) {
        console.log(joby)
    }
    console.log("*********************************************")

    let scheduledJobs = [];
    let currTime = 0;
    let brokenDeadLine = {};
    while (currTime <= maxTime && (allJobs.length > 0||jobsQueue.length>0)) {
        for (let i = 0; i < allJobs.length; i++) {
            if (currTime > allJobs[i].deadLine && Object.keys(brokenDeadLine).length === 0) {
                brokenDeadLine = { taskid: allJobs[i].taskid, jopid: allJobs[i].jobid, time: currTime }
            }
            console.log(allJobs[i], currTime)
            if (allJobs[i].releaseTime <= currTime) {
                jobsQueue.push(allJobs[i]);
                allJobs.splice(i, 1);
                i--; // Adjust index after splicing
            }

        }

        console.log("*********************************************")
        console.log(currTime)
        for (const joby of jobsQueue) {
            console.log(joby)
        }
        console.log("*********************************************")

        let currJob = jobsQueue.shift();
        if (currJob === undefined) {
            currTime++;
            continue;
        }
        let jobExecution = Math.min(timeQuantum, currJob.executionTime);
        currJob.executionTime -= jobExecution;
        if (currTime + jobExecution > currJob.deadLine && Object.keys(brokenDeadLine).length === 0) {
            brokenDeadLine = { taskid: currJob.taskid, jopid: currJob.jobid, time: currTime }
        }
        scheduledJobs.push({ taskid: currJob.taskid, jopid: currJob.jobid, arrivalTime: currTime, burstTime: jobExecution, color: currJob.color });
        currTime += jobExecution;


        for (let i = 0; i < allJobs.length; i++) {
            if (allJobs[i].releaseTime <= currTime) {
                jobsQueue.unshift(allJobs[i]);
                allJobs.splice(i, 1);
                i--;

            }
        }


        if (currJob.executionTime > 0) {
            jobsQueue.push(currJob);
        }
        console.log(currJob)
        console.log("????????????????????????????????????")
        console.log(currTime)
        for (const joby of jobsQueue) {
            console.log(joby)
        }
        console.log("???????????????????????????????????//")

    }
    console.log(scheduledJobs, brokenDeadLine)
    return { processes: scheduledJobs, brokendeadline: brokenDeadLine };

}

export function schedulePeriodicRR(tasksData, maxTime, timeQuantum) {

    console.log(tasksData, maxTime)
    const scheduledJobs = scheduleJobs(tasksData, maxTime, timeQuantum);
    return scheduledJobs;
}
// let tasksData = [{ taskid: 1, releaseTime: 0, period: 6, executionTime: 2, deadLine: 6, priority: 1 }
//     , { taskid: 2, releaseTime: 1, period: 8, executionTime: 2, deadLine: 8, priority: 6 }
//     , { taskid: 3, releaseTime: 2, period: 15, executionTime: 4, deadLine: 15, priority: 2 }]

//     let timeQuantum=.25 ;
//     let maxTime=30 ;