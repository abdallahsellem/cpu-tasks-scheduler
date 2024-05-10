function RMA(processesData , maxTime) {
    const processes = processesData.map((process, index) => ({
        pid: process.taskid,
        releaseTime: process.releaseTime,
        periodicTime: process.periodicTime,
        executionTime: process.executionTime,
        deadline: process.deadLine       
    }));

    let currentTime = 0;
    let scheduledProcesses = [];
    let exceededProcesses = [];
    let currentProcess = null;
    let x = -1 ; 
    let deadLines = []

    while(true) {

        if(currentProcess?.releaseTime + processes?.executionTime > processes.deadLine){
            deadLines.push({
                jopid: currentProcess.jopid , 
                taskid : currentProcess.taskid , 
                time : currentTime
            })
        }



        if (currentTime > maxTime) {
            break ;
        }

        if(currentProcess?.executionTime === 0 ) { 
            scheduledProcesses = scheduledProcesses.filter((process) => !(process.pid === currentProcess.pid && process.jobid === currentProcess.jobid))
            currentProcess = null 
        }else if (currentProcess) {
            scheduledProcesses = scheduledProcesses.map((process) => process.pid === currentProcess.pid && process.jobid === currentProcess.jobid ? currentProcess : process)

        }
        

        processes.forEach((process) => {

            for(let currentTimeIndex = x + 1 ; currentTimeIndex <= currentTime ; currentTimeIndex++) {

            if( currentTimeIndex % (process.releaseTime  + process.periodicTime ) === 0 ||  currentTimeIndex  == process.releaseTime   ) {
                const jobid  = Math.floor(currentTimeIndex / (process.releaseTime  + process.periodicTime ))  + 1
                if(!(currentTimeIndex === 0 && process.releaseTime !== 0) ) {
                    scheduledProcesses.push({
                            pid: process.pid,
                            jobid ,
                            deadline : process.deadline * jobid , 
                            releaseTime : process.releaseTime + ((jobid - 1 )* process.periodicTime )  , 
                            periodicTime : process.periodicTime ,
                            executionTime : process.executionTime
                          
                        })
                }
            }
        }

        })


        let earlierPriorityProcess = scheduledProcesses.reduce((min, process) =>
            process.periodicTime < min.periodicTime ? process : min, scheduledProcesses[0]);


        let nextChange = processes.reduce((min, process) => {
            const numPeriod = Math.ceil((currentTime + 0.1)/ process.periodicTime) 
            let time = numPeriod * process.periodicTime - currentTime + process.releaseTime
            if(process.releaseTime + (numPeriod - 1) * process.periodicTime  < time && currentTime < process.releaseTime + (numPeriod - 1) * process.periodicTime ) {
                time = process.releaseTime + (numPeriod - 1) * process.periodicTime 
            }

            const minNumPeriod = Math.ceil((currentTime + 0.1)/ min.periodicTime) 
            let minTime = minNumPeriod * min.periodicTime - currentTime + min.releaseTime
            if(min.releaseTime + (numPeriod - 1) * min.periodicTime  < minTime && currentTime < min.releaseTime + (numPeriod - 1) * min.periodicTime ) {
                minTime = min.releaseTime + (numPeriod - 1) * min.periodicTime 
            }
            min.time = minTime
            process.time = time 
             return  process.time <  min.time ? process : min
        }, processes[0])


        if (!earlierPriorityProcess ) {
            currentTime += nextChange.time
            continue
            
        }else { 
            currentProcess = earlierPriorityProcess
        }

        x = currentTime 
        const nextStep =  Math.min((nextChange.periodicTime < currentProcess.periodicTime ? nextChange.time : earlierPriorityProcess.executionTime ) , earlierPriorityProcess.executionTime )
       
        currentTime += nextStep




        if (currentProcess) {
            exceededProcesses.push({
                arrivalTime : x, 
                burstTime :nextStep , 
                pid : currentProcess.pid ,
                ...currentProcess
                
            })
            currentProcess.executionTime -= nextStep
        }
    }
    const [brokendeadline] = deadLines


    return { processes: exceededProcesses , brokendeadline };

}

const processes = [
    {taskid : 3 , releaseTime : 0 , periodicTime : 48 , executionTime : 4 , deadLine : 48},
    {taskid : 2 , releaseTime : 0 , periodicTime : 36 , executionTime : 12 , deadLine : 36},
    {taskid : 1 , releaseTime : 0 , periodicTime : 24 , executionTime : 7 , deadLine : 24},
]

const data = RMA(processes , 70)
console.log(data)