class Task {
    constructor(taskName, releaseTime, period, executionTime, deadline, maxTime) {
        this.taskName = taskName;
        this.releaseTime = releaseTime;
        this.period = period;
        this.executionTime = executionTime;
        this.remainingExecution = 0;
        this.deadline = deadline;
        this.deadlineBroken = false;
        this.maxtime = maxTime;
        this.priority = null;
        this.readyTimes = [];
        for (let time of this.generateTimeRange(releaseTime, maxTime + 1, period)) {
            this.readyTimes.push(time);
        }
        this.readyTimes.push(this.readyTimes[this.readyTimes.length - 1] + period);
        this.deadlines = this.readyTimes.map(readyTime => readyTime + this.deadline);
        this.executionTimes = [];
        this.brokenDeadlines = [];
    }

    generateTimeRange(start, end, step) {
        let timeRange = [start];
        if (step !== 0) {
            while (true) {
                start += step;
                if (start > end) {
                    break;
                }
                timeRange.push(parseFloat(start.toFixed(2)));
            }
        }
        return timeRange;
    }

    updateDeadline(t) {
        for (let deadline of this.deadlines) {
            if (deadline > t) {
                this.deadline = deadline;
                break;
            }
        }
    }
}
export default Task;