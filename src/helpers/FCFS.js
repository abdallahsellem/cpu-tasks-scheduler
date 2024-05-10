import chroma from 'chroma-js'; // Import chroma-js for color manipulation

export function FIFO(processes_data , max_time) {
  const deadLines = []
  const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(processes_data.length);
  const processes = []
  for (let i = 0;  i < max_time ; i++) {
    // const arrivalTime = processes_data.map((process) => i - process.releaseTime)
    // const minimumArrivalTime = Math.max(...arrivalTime)
    // const minimumArrivalTimeIndex = arrivalTime.indexOf(minimumArrivalTime)

    const maximumArrivalProcess = processes_data.reduce((acc, process) => {
      const arrivalTime = i - process.releaseTime;
      if (arrivalTime > acc.maxArrivalTime) {
          return { process, maxArrivalTime: arrivalTime };
      }
      return acc;
  }, { process: null, maxArrivalTime: -Infinity });

  const minimumArrivalTime = maximumArrivalProcess.maxArrivalTime
  const executedProcess = maximumArrivalProcess.process 
  

    if(minimumArrivalTime < 0) {
      continue ;
    }


    if (executedProcess.executionTime + i > executedProcess.deadLine  ) {
      // processes.push({
      //   taskid : executedProcess.taskid ,
      //   arrivalTime : i ,
      //   burstTime : Math.max( executedProcess.deadLine - i + 1, 0 ) ,
      //   color : colorScale[executedProcess.taskid]
      // })

      const processNumber = processes.filter(process => process.taskid === executedProcess.taskid ).length + 1
      const message = `deadLine exceeded from process T${executedProcess.taskid}${processNumber} at ${executedProcess.deadLine}`
      deadLines.push({
        taskid: executedProcess.taskid ,
        jobid : processNumber , 
        time : executedProcess.deadLine
      })
    }


      // return [processes ,  executedProcess.taskid , processNumber, executedProcess.deadLine]
    // }else {
      const processNumber = processes.filter(process => process.taskid === executedProcess.taskid ).length + 1
      processes.push({
        taskid : executedProcess.taskid ,
        arrivalTime : i ,
        burstTime : executedProcess.executionTime ,
        jobid:processNumber,
        color : colorScale[executedProcess.taskid]
      })
      i += executedProcess.executionTime - 1
      executedProcess.releaseTime += executedProcess.period 
      executedProcess.deadLine += executedProcess.period 
    // }


  }
  const [brokendeadline] = deadLines

  return {processes , brokendeadline}
}