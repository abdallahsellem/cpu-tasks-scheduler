import React,{useState,useRef,useEffect} from 'react';
import Process from './Process';
import './Scheduler.css'; // Import CSS file for styling
import {useMyContext } from '../context/TasksData';
const ChartScheduling = ( ) => {
  const { maxTime,tasks } = useMyContext();
    const [processParWidth, setProcessParWidthWidth] = useState(null);
  const processContainerRef = useRef(null);
  useEffect(() => {
    if (processContainerRef.current) {
      // Accessing clientWidth of the div
      setProcessParWidthWidth(processContainerRef.current.getBoundingClientRect().width);
    }
  }, [processContainerRef]);
  return (
<div className="scheduler-container">
      <div className="timeline-container">
        {[...Array(maxTime + 1).keys()].map((time) => (
          <div key={time} className="timeline" ref={processContainerRef}>
            {time}
          </div>
        ))}
      </div>
      <div className="processes-container" >
        {/* Processes */}
        {tasks.map((process) => (
          <>            
          <Process
            key={process.taskid}
            pid={process.taskid}
            arrivalTime={process.arrivalTime}
            burstTime={process.burstTime}
            color={process.color}
            jobid={process.jobid}
            parWidth={processParWidth}
          /></>
          
        ))}
      </div>
      <div className="time-axis">
        Time
      </div>
    </div>
  );
};
export default ChartScheduling;
