import chroma from 'chroma-js'; // Import chroma-js for color manipulation

export function FIFO(processes_data) {
  console.log(processes_data)
  const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(processes_data.length);
  const processes = []
  for (let i = 0;  i < 100 ; i++) {
    const arrivalTime = processes_data.map((process) => i - process.releaseTime)
    const minimumArrivalTime = Math.max(...arrivalTime)
    const minimumArrivalTimeIndex = arrivalTime.indexOf(minimumArrivalTime)
    if(minimumArrivalTime < 0) {
      continue ;
    }


    if (processes_data[minimumArrivalTimeIndex].executionTime + i > processes_data[minimumArrivalTimeIndex].deadLine  ) {
      processes.push({
        taskid : minimumArrivalTimeIndex + 1 ,
        arrivalTime : i ,
        burstTime : Math.max( processes_data[minimumArrivalTimeIndex].deadLine - i + 1, 0 ) ,
        color : colorScale[minimumArrivalTimeIndex]
      })

      const processNumber = processes.filter(process => process.taskid === minimumArrivalTimeIndex + 1 ).length
      const message = `deadLine exceeded from process T${minimumArrivalTimeIndex+1}${processNumber} at ${processes_data[minimumArrivalTimeIndex].deadLine + 1}`
      // console.log(message)

      // setErrorMessage(message)

      return [processes ,  minimumArrivalTimeIndex , i]
    }else {
      processes.push({
        taskid : minimumArrivalTimeIndex + 1 ,
        arrivalTime : i ,
        burstTime : processes_data[minimumArrivalTimeIndex].executionTime ,
        color : colorScale[minimumArrivalTimeIndex]
      })
      i += processes_data[minimumArrivalTimeIndex].executionTime - 1
      processes_data[minimumArrivalTimeIndex].releaseTime += processes_data[minimumArrivalTimeIndex].period 
      processes_data[minimumArrivalTimeIndex].deadLine += processes_data[minimumArrivalTimeIndex].period 
    }


  }

  return [processes]
}