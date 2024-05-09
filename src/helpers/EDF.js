
import chroma from 'chroma-js'; // Import chroma-js for color manipulation
function scheduleJobs(tasksData, maxTime) {

    //
    // in this algorithm we are using only execution time and Period 
    //
    const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(tasksData.length);
    let jobsQueue = []
    let allJobs = []
    let scheduledJobs = []

    let taskIndex = 0;
    for (const task of tasksData) {
        let currTime = 0;
        let currDeadLine = task.period;
        let jobsCounter = 1;
        while (currTime <= maxTime) {
            allJobs.push({ taskid: task.taskid, jobid: jobsCounter, releaseTime: currTime, executionTime: task.executionTime, deadLine: currDeadLine, color: colorScale[taskIndex] })
            currTime += task.period;
            currDeadLine += task.period;
            jobsCounter++;
        }
        taskIndex++;
    }
    allJobs.sort((a, b) => a.releaseTime - b.releaseTime);

    let currTime = 0;
    let currJob = {};
    let brokenDeadLine ={} 
    while (currTime < maxTime && allJobs.length > 0) {
        console.log(currTime)
        let minimum_deadline = 10000000;
        let minimum_deadline_job = {};

        for (const job of allJobs) {
            if (job.deadLine < minimum_deadline && job.releaseTime <= currTime) {
                minimum_deadline = job.deadLine;
                minimum_deadline_job = job;
            }
        }

        const findIndex = allJobs.findIndex(a => a === minimum_deadline_job)
        findIndex !== -1 && allJobs.splice(findIndex, 1)


        currJob = minimum_deadline_job;
        let currTimeNext = maxTime;
        if (allJobs[0].releaseTime > currTime && allJobs[0].releaseTime <= currTime + currJob.executionTime) {
            currTimeNext = allJobs[0].releaseTime;
        }
        else {
            currTimeNext = currTime + currJob.executionTime;
        }
        let executionTime = currJob.executionTime;
        executionTime -= currTimeNext - currTime;

        console.log(currJob, currTimeNext, executionTime)

        if(currJob.deadLine<currTime+currTimeNext - currTime)
            {
                brokenDeadLine={taskid:currJob.taskid,jopid:currJob.jobid,time:currTime}
            }
        scheduledJobs.push({ taskid: currJob.taskid, jopid: currJob.jobid, arrivalTime: currTime, burstTime: currTimeNext - currTime, color: currJob.color });
        if (executionTime > 0) {
            currJob.executionTime = executionTime;
            allJobs.unshift(currJob);
        }
        currTime = currTimeNext;
    }
    return { processes : scheduledJobs ,brokendeadline: brokenDeadLine  };

}
export function schedulePeriodicEDF(tasksData,maxTime) {
    console.log("said")
    const scheduledJobs = scheduleJobs(tasksData, maxTime);
    console.log(scheduledJobs)
    return scheduledJobs;
}




