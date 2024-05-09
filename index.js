function runMinimumLaxity(processes_data) {
    const processes = processes_data.map((process, index) => ({
        pid: index + 1,
        releaseTime: process.releaseTime,
        periodicTime: process.periodicTime,
        executionTime: process.executionTime,
        deadline: process.deadLine       
    }));

    

    let currentTime = 0;
    let scheduledProcesses = [];
    let exceededProcesses = [];
    let currentProcess = null;

    while (true) {
        if(currentTime > 30) {
            break
        }

        if(currentProcess?.executionTime === 0 ) { 
            scheduledProcesses = scheduledProcesses.filter((process) => !(process.pid === currentProcess.pid && process.turn === currentProcess.turn))
            currentProcess = null 
        }else if (currentProcess) {
            scheduledProcesses = scheduledProcesses.map((process) => process.pid === currentProcess.pid && process.turn === currentProcess.turn ? currentProcess : process)

        }

        processes.forEach((process) => {
            if( currentTime % (process.releaseTime  + process.periodicTime ) === 0 ) {
                const turn  = currentTime / (process.releaseTime  + process.periodicTime )  + 1
                if(!(currentTime === 0 && process.releaseTime !== 0) ) {
                    scheduledProcesses.push({
                            pid: process.pid,
                            turn ,
                            deadline : process.deadline * turn , 
                            releaseTime : process.releaseTime + ((turn - 1 )* process.periodicTime )  , 
                            periodicTime : process.periodicTime ,
                            executionTime : process.executionTime
                          
                        })
                }
            }

        })

        // Calculate the laxity for each process
        scheduledProcesses.forEach(process => {
            let timeUntilDeadline = process.deadline - currentTime;
            let remainingExecutionTime = process.executionTime;
            let laxity = timeUntilDeadline - remainingExecutionTime;

            if (laxity >= 0) {
                process.laxity = laxity;
                process.color = '';
            }
        });



        // Find the process with the minimum laxity
        let minLaxityProcess = scheduledProcesses.reduce((min, process) =>
            process.laxity < min.laxity ? process : min, scheduledProcesses[0]);

        let nextChange = processes.reduce((min, process) => {
            let time = Math.ceil((currentTime + 0.1)/ process.periodicTime) * process.periodicTime - currentTime + process.releaseTime
            let minTime = Math.ceil((currentTime+0.1) / min.periodicTime) * min.periodicTime - currentTime + min.releaseTime
            process.time = time 
            min.time = minTime
             return  process.time <  min.time ? process : min
        }, processes[0])


        
        // If all processes have laxity <= 0, break the loop

        if (!minLaxityProcess ) {
            currentTime += nextChange.time
            continue
            
        }else if (minLaxityProcess.laxity < 0) {
            break ;
        }
        else { 
            currentProcess = minLaxityProcess
        }
        const x = currentTime 
        currentTime += Math.min(nextChange.time , minLaxityProcess.executionTime)


        if (currentProcess) {
            exceededProcesses.push({
                arrivalTime : x, 
                burstTime : Math.min(nextChange.time , currentProcess.executionTime) , 
                pid : currentProcess.pid ,
                ...currentProcess
                
            })
            currentProcess.executionTime -= Math.min(nextChange.time , currentProcess.executionTime)
        }
    }

    return { processes: scheduledProcesses, exceededProcesses };
}
