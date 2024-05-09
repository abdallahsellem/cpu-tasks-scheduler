
import chroma from 'chroma-js'; // Import chroma-js for color manipulation

export function runMinimumLaxity(processes_data , max_time) {

    const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(processes_data.length);

    const processes = processes_data.map((process, index) => ({
        pid: process.taskid,
        releaseTime: process.releaseTime,
        periodicTime: process.period,
        executionTime: process.executionTime,
        deadline: process.deadLine       
    }));

    

    let currentTime = 0;
    let scheduledProcesses = [];
    let exceededProcesses = [];
    let currentProcess = null;
    const deadLines = []

    while (true) {
        if(currentTime > max_time) {
            break
        }

        if(currentProcess?.executionTime === 0 ) { 
            scheduledProcesses = scheduledProcesses.filter((process) => !(process.pid === currentProcess.pid && process.jopid === currentProcess.jopid))
            currentProcess = null 
        }else if (currentProcess) {
            scheduledProcesses = scheduledProcesses.map((process) => process.pid === currentProcess.pid && process.jopid === currentProcess.jopid ? currentProcess : process)

        }

        processes.forEach((process) => {
            if( currentTime % (process.releaseTime  + process.periodicTime ) === 0 ) {
                const jopid   = currentTime / (process.releaseTime  + process.periodicTime )  + 1
                if(!(currentTime === 0 && process.releaseTime !== 0) ) {
                    scheduledProcesses.push({
                            pid: process.pid,
                            jopid  ,
                            deadline : process.deadline * jopid  , 
                            releaseTime : process.releaseTime + ((jopid - 1 )* process.periodicTime )  , 
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
            }else {
                process.laxity = 10000
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

        if (scheduledProcesses.length === 0) {
            currentTime += nextChange.time
            continue
            
        }else if (minLaxityProcess.laxity === 10000) {

            deadLines.push({
                jopid: minLaxityProcess.jopid , 
                taskid : minLaxityProcess.taskid , 
                time : currentTime
            })
        //    return [exceededProcesses , minLaxityProcess]
        currentProcess = minLaxityProcess
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
                taskid : currentProcess.pid ,
                ...currentProcess,color:colorScale[currentProcess.pid]
                
            })
            currentProcess.executionTime -= Math.min(nextChange.time , currentProcess.executionTime)
        }
    }
    const [brokendeadline] = deadLines
    return { processes : exceededProcesses , brokendeadline  };
}
