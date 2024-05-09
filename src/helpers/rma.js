function scheduleRateMonotonic(tasks, maxTime) {
    // Sort tasks by period (lowest period has highest priority)
    tasks.sort((a, b) => a.period - b.period);
  
    const schedule = [];
    let currentTime = 0;
    let jobId = 0;
  
    while (currentTime < maxTime) {
      // Check if any task is ready to run
      const nextTask = tasks.find((task) => currentTime % task.period === 0);
  
      if (nextTask) {
        const { taskid, period, executionTime } = nextTask;
  
        // Check for deadline miss
        if (currentTime + executionTime > Math.min(period, maxTime)) {
          throw new Error(`Task ${taskid} misses deadline with period ${period}`);
        }
  
        schedule.push({
          taskid,
          jobid: jobId++,
          startTime: currentTime,
          executionTime,
        });
  
        currentTime += executionTime;
      } else {
        // No ready tasks, advance time to next potential start time
        currentTime = Math.min(...tasks.map((task) => Math.ceil(currentTime / task.period) * task.period));
      }
    }
  
    return schedule;
  }
  
export function rateMonotonicSchedulingRma (){
// Example usage:
const tasks = [
    { taskid: 1, period: 20, executionTime: 2 },
    { taskid: 2, period: 20, executionTime: 3 },
    { taskid: 3, period: 20, executionTime: 4 },
  ];

let time = 48; // Total simulation time
let schedule = scheduleRateMonotonic(tasks, time);
console.log(schedule);
}
