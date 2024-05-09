import chroma from 'chroma-js'; // Import chroma-js for color manipulation

function scheduleJobs(tasksData, timeQuantum, maxTime) {
    const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(tasksData.length);

    let jobsQueue = []
    let allJobs = []
    let taskIndex=0 ;
    for (const task of tasksData) {
        let currTime = task.releaseTime;
        let currDeadLine = task.deadLine;
        let jobsCounter =1 ;
        while (currTime <= maxTime) {
            allJobs.push({ taskid: task.taskid,jobid:jobsCounter,releaseTime: currTime, period: task.period, executionTime: task.executionTime, deadLine: currDeadLine, priority: task.priority,color:colorScale[taskIndex] })
            currTime+=task.period ;
            currDeadLine+=task.period ;
            jobsCounter++ ;
        }
        taskIndex++ ;
    }
    allJobs.sort((a, b) => a.releaseTime - b.releaseTime);
    let scheduledJobs = [];
    let z = 0;
    let currTime = 0;
    while (currTime <= maxTime && allJobs.length > 0) {
        for (let i = 0; i < allJobs.length; i++) {
            if (allJobs[i].releaseTime <= currTime) {
                jobsQueue.push(allJobs[i]);
                allJobs.splice(i, 1);
                i--; // Adjust index after splicing
            }
        }
        let currJob = jobsQueue.shift();
        if (currJob === undefined) {
            currTime++;
            continue;
        }
        let jobExecution = Math.min(timeQuantum, currJob.executionTime);
        currJob.executionTime -= jobExecution;
       
        currTime += jobExecution;
        scheduledJobs.push({ taskid: currJob.taskid, jobid: currJob.jobid, releaseTime: currTime, executionTime: jobExecution ,color:currJob.color});

        for (let i = 0; i < allJobs.length; i++) {
            if (allJobs[i].releaseTime <= currTime) {
                jobsQueue.unshift(allJobs[i]);
                allJobs.splice(i, 1);
                i--; // Adjust index after splicing
            }
        }
        if(currJob.executionTime>0)
            {
                jobsQueue.push(currJob) ;
            }
    }
    console.log(scheduledJobs)
}

export function schedulePeriodicRR() {

    let tasksData = [{ taskid: 1, releaseTime: 4, period: 6, executionTime: 2, deadLine: 10, priority: 1 }
        , { taskid: 2, releaseTime: 4, period: 10, executionTime: 6, deadLine: 12, priority: 6 }
        , { taskid: 3, releaseTime: 0, period: 7, executionTime: 8, deadLine: 20, priority: 2 }]

        let timeQuantum=2 ;
        let maxTime=30 ;
    const scheduledJobs = scheduleJobs(tasksData, timeQuantum, maxTime);
    console.log(scheduledJobs)
    return scheduledJobs;
}
