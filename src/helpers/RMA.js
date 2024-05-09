class Task {
    constructor(name, periodTime, executionTime) {
        this.name = name;
        this.periodTime = periodTime;
        this.executionTime = executionTime;
    }
}

class RateMonotonicScheduler {
    constructor(tasks, hyperperiod) {
        this.tasks = tasks;
        this.hyperperiod = hyperperiod;
        this.realTimeTasks = tasks;
        this.dlist = Object.fromEntries(tasks.map(task => [task.name, { start: [], finish: [] }]));
        this.dlist["TASK_IDLE"] = { start: [], finish: [] };
        this.timeline = [];
    }

    static leastCommonMultiple(a, b) {
        function gcd(x, y) {
            while (y !== 0) {
                let temp = y;
                y = x % y;
                x = temp;
            }
            return x;
        }
        return Math.abs(a * b) / gcd(a, b);
    }

    analyzeCriticalInstance() {
        const sortedTasks = this.tasks.sort((a, b) => a.periodTime - b.periodTime);
        for (let i = 0; i < sortedTasks.length; i++) {
            const task = sortedTasks[i];
            const period = task.periodTime;
            const executionTime = task.executionTime;
            for (let time = 1; time <= period; time++) {
                const responseTime = executionTime + sortedTasks.slice(0, i).reduce((acc, t) =>
                    acc + Math.ceil(time / t.periodTime) * t.executionTime, 0);
                if (responseTime > period) {
                    return true;
                }
            }
        }
        return false;
    }

    performSimulation() {
        for (let t = 0; t < this.hyperperiod; t++) {
            const priority = this.determinePriority();
            if (priority !== -1) {
                const task = this.realTimeTasks[priority];
                task.executionTime--;
                this.dlist[task.name].start.push(t);
                this.dlist[task.name].finish.push(t + 1);
                this.timeline.push(task.name);
            } else {
                this.dlist["TASK_IDLE"].start.push(t);
                this.dlist["TASK_IDLE"].finish.push(t + 1);
                this.timeline.push("IDLE");
            }

            this.realTimeTasks.forEach(task => {
                task.periodTime--;
                if (task.periodTime === 0) {
                    const originalTask = this.tasks.find(t => t.name === task.name);
                    task.periodTime = originalTask.periodTime;
                    task.executionTime = originalTask.executionTime;
                }
            });
        }
    }

    determinePriority() {
        const availableTasks = this.realTimeTasks.map((task, i) => [i, task])
            .filter(([_, task]) => task.executionTime > 0);
        if (!availableTasks.length) {
            return -1;  // Indicates that the processor is idle
        }
        return availableTasks.reduce((a, b) => a[1].periodTime < b[1].periodTime ? a : b)[0];
    }

    generateScheduleTimeline() {
        let timeline = [];
        let currentTask = null;
        let startTime = 0;

        for (let i = 0; i < this.timeline.length; i++) {
            const task = this.timeline[i];
            if (task !== currentTask) {
                if (currentTask !== null) {
                    timeline.push({ taskId: currentTask, startTime: startTime, endTime: i });
                }
                currentTask = task;
                startTime = i;
            }
        }
        // Append the last task
        timeline.push({ taskId: currentTask, startTime: startTime, endTime: this.hyperperiod });

        return timeline;
    }

    run() {
        if (!this.analyzeCriticalInstance()) {
            this.performSimulation();
            return this.generateScheduleTimeline();
        } else {
            console.log("\n\tTasks are not schedulable by Rate Monotonic Scheduling!");
            return null;
        }
    }
}

export function schedulePeriodicRMA() {
    let tasksData = [{ taskid: 1, releaseTime: 4, period: 6, executionTime: 2, deadLine: 10, priority: 1 }
        , { taskid: 2, releaseTime: 4, period: 10, executionTime: 6, deadLine: 12, priority: 6 }
        , { taskid: 3, releaseTime: 0, period: 7, executionTime: 8, deadLine: 20, priority: 2 }]
    let data = [];
    console.log(tasksData)
    for (const task of tasksData) {
        let newTask = new Task(task.taskid, task.period, task.executionTime)
        data.push(newTask)

    }
    console.log(data)
     const tasks = [
    new Task("T1", 7, 16),
    new Task("T2", 4, 8),
    new Task("T3", 12, 8)
 ];
    let rateMonotonicAssignment = new RateMonotonicScheduler(tasks, 15);
    let results = rateMonotonicAssignment.run();
    console.log(results)
    return results;
}

// // Example usage

// const scheduler = new RateMonotonicScheduler(tasks, 25);
// console.log(scheduler.run());
