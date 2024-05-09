import Task from "./task.js";

class DeadlineMonotonicAssignment {
    constructor(tasks, maxTime) {
        this.tasks = tasks;
        this.maxTime = maxTime;
        this.currentTime = 0;
        this.setPrioritiesBasedOnDeadLine();
        this.executeList = [];
        while (this.currentTime < this.maxTime) {
            let task = this.getHighestPriorityTask();
            this.run(task);
        }
    }

    setPrioritiesBasedOnDeadLine() {
        let tasksDeadlines = this.tasks.map(task => task.deadline);
        let count = 1;
        let tasksPriorities = [];
        for (let deadline1 of tasksDeadlines) {
            for (let deadline2 of tasksDeadlines) {
                if (deadline1 > deadline2) {
                    count += 1;
                }
            }
            tasksPriorities.push(count);
            count = 1;
        }
        for (let [index, task] of this.tasks.entries()) {
            task.priority = tasksPriorities[index];
        }
    }

    getHighestPriorityTask() {
        if (this.executeList.length === 0) {
            let tasksReadyTime = this.tasks.map(task => [task, task.readyTimes[0]]);
            for (let [task, readyTime] of tasksReadyTime) {
                if (readyTime <= this.currentTime) {
                    task.remainingExecution = task.executionTime;
                    this.executeList.push(task);
                    task.readyTimes.shift();
                }
            }
            if (this.executeList.length === 0) {
                this.currentTime = Math.min(...tasksReadyTime.map(([_, readyTime]) => readyTime));
                this.updateTasksRemainingExecution();
                return this.getHighestPriorityTask();
            }
        }
        let priorities = this.executeList.map(task => task.priority);
        let highestPriorityIndex = priorities.indexOf(Math.min(...priorities));
        return this.executeList[highestPriorityIndex];
    }

    updateTasksRemainingExecution() {
        for (let task of this.tasks) {
            if (task.readyTimes[0] <= this.currentTime) {
                if (task.remainingExecution === 0 || task.deadlineBroken) {
                    this.executeList.push(task);
                    task.remainingExecution = task.executionTime;
                    task.readyTimes.shift();
                }
                task.updateDeadline(this.currentTime);
            }
        }
    }

    getExecutionTimeToStopTask(task) {
        let tasksReadyTime = this.tasks.map(t => t.readyTimes[0]);
        let nearestReadyTime = Math.min(...tasksReadyTime);
        if (this.currentTime + task.remainingExecution < nearestReadyTime) {
            return this.currentTime + task.remainingExecution;
        } else {
            return nearestReadyTime;
        }
    }

    run(task) {
        let startTime = this.currentTime;
        let endTime = this.getExecutionTimeToStopTask(task);
        task.remainingExecution -= (endTime - startTime);
        if (endTime > this.maxTime) {
            task.executionTimes.push([startTime, this.maxTime]);
        } else {
            task.executionTimes.push([startTime, endTime]);
        }
        if (task.remainingExecution === 0) {
            this.executeList.splice(this.executeList.indexOf(task), 1);
        }
        // Check if the task missed its deadline
        for (let task of this.tasks) {
            if (task.remainingExecution !== 0 && task.deadline <= endTime) {
                if (!task.brokenDeadlines.includes(task.deadline)) {
                    task.brokenDeadlines.push(task.deadline);
                    task.deadlineBroken = true;
                }
            } else {
                task.deadlineBroken = false;
            }
        }
        this.currentTime = endTime;
        this.updateTasksRemainingExecution();
    }

    getResults() {
        let results = [];
        this.tasks.forEach(task => {
            task.executionTimes.forEach(([startTime, endTime]) => {
                results.push({
                    taskId: task.taskName,
                    startTime: startTime,
                    endTime: endTime
                });
            });
        });
        return results;
    }
}    
let maxTime = 100;
let tasks = [
    new Task("Task1", 0, 60, 25, 50, maxTime),   
    new Task("Task2", 15, 60, 10, 40, maxTime),  
    new Task("Task3", 20, 60, 15, 60, maxTime)   
];
let deadlineMonotonicAssignment = new DeadlineMonotonicAssignment(tasks, maxTime);

let results = deadlineMonotonicAssignment.getResults();
console.log(results);