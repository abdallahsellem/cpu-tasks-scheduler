
import chroma from 'chroma-js'; // Import chroma-js for color manipulation
import { schedulePeriodicRR } from './RR';
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
            console.log(currTime)

            allJobs.push({ taskid: task.taskid, jobid: jobsCounter, releaseTime: currTime, executionTime: task.executionTime, deadLine: currDeadLine, color: colorScale[taskIndex] })
            currTime += task.period;
            currDeadLine += task.period;
            jobsCounter++;
        }
        taskIndex++;
    }
    allJobs.sort((a, b) => a.releaseTime - b.releaseTime);
    console.log(allJobs[0], allJobs[1])
    let currTime = 0;
    let currJob = {};
    let brokenDeadLine = {}
    let jobsWithSamePriority = []
    while (currTime < maxTime && allJobs.length > 0) {
        console.log(currTime, allJobs.length)
        let minimum_deadline = 10000000;
        let minimum_deadline_job = {};

        for (const job of allJobs) {
            if (job.deadLine < minimum_deadline && job.releaseTime <= currTime) {
                minimum_deadline = job.deadLine;
                minimum_deadline_job = job;
            }

            if (job.deadLine < currTime) {
                brokenDeadLine = { taskid: job.taskid, jopid: job.jobid, time: currTime }
            }
        }
        for (const job of allJobs) {
            if (job.deadLine == minimum_deadline && job.releaseTime <= currTime) {
                jobsWithSamePriority.push(job);
            }
        }
        if (minimum_deadline === 10000000 && allJobs.length > 0) {
            currTime = allJobs[0].releaseTime;
            continue
        }
        if (jobsWithSamePriority.length > 1) {
            let maxTimeTemp = jobsWithSamePriority[0].deadLine;
            let tempData = schedulePeriodicRR(jobsWithSamePriority, .25, jobsWithSamePriority[0].deadLine);

            for (const job of jobsWithSamePriority) {
                const findIndex = allJobs.findIndex(a => a === job)
                findIndex !== -1 && allJobs.splice(findIndex, 1)
            }
            scheduledJobs = scheduledJobs.concat(tempData)
            currTime = maxTimeTemp;
            continue;
        }

        const findIndex = allJobs.findIndex(a => a === minimum_deadline_job)
        findIndex !== -1 && allJobs.splice(findIndex, 1)

        currJob = minimum_deadline_job;
        let currTimeNext = maxTime;
        if (allJobs.length == 0 && minimum_deadline != 10000000) {
            console.log(currJob)
            scheduledJobs.push({ taskid: currJob.taskid, jopid: currJob.jobid, arrivalTime: currTime, burstTime: currJob.executionTime, color: currJob.color });
            break;
        }

        if (allJobs[0].releaseTime > currTime && allJobs[0].releaseTime <= currTime + currJob.executionTime) {
            currTimeNext = allJobs[0].releaseTime;
        }
        else {
            currTimeNext = currTime + currJob.executionTime;
        }
        let executionTime = currJob.executionTime;
        executionTime -= currTimeNext - currTime;

        if (currJob.deadLine < currTime + currTimeNext - currTime) {
            brokenDeadLine = { taskid: currJob.taskid, jopid: currJob.jobid, time: currTime }
        }


        scheduledJobs.push({ taskid: currJob.taskid, jopid: currJob.jobid, arrivalTime: currTime, burstTime: currTimeNext - currTime, color: currJob.color });
        if (executionTime > 0) {
            currJob.executionTime = executionTime;
            allJobs.unshift(currJob);
        }
        currTime = currTimeNext;
    }
    return { processes: scheduledJobs, brokendeadline: brokenDeadLine };

}
export function schedulePeriodicEDF(tasksData, maxTime) {
    console.log("said")
    const scheduledJobs = scheduleJobs(tasksData, maxTime);
    console.log(scheduledJobs)
    return scheduledJobs;
}




