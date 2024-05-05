import React,{useState,useRef,useEffect} from 'react';
import Process from './Process';
import './Scheduler.css'; // Import CSS file for styling
import chroma from 'chroma-js'; // Import chroma-js for color manipulation
const ChartScheduling = ({ processes }) => {
  const maxTime = processes.reduce((acc, process) => Math.max(acc, process.arrivalTime + process.burstTime), 0);
  const [processParWidth, setProcessParWidthWidth] = useState(null);
  const processContainerRef = useRef(null);
  const colorScale = chroma.scale(['#00FF00', '#FF0000']).mode('lab').colors(processes.length);
  useEffect(() => {
    if (processContainerRef.current) {
      // Accessing clientWidth of the div
      setProcessParWidthWidth(processContainerRef.current.getBoundingClientRect().width);
      console.log(processContainerRef.current.getBoundingClientRect().width)
      
    }
  }, [processContainerRef]);
  return (
<div className="scheduler-container">
      <div className="timeline-container">
        {/* Timeline */}
        {[...Array(maxTime + 1).keys()].map((time) => (
          <div key={time} className="timeline" ref={processContainerRef}>
            {time}
          </div>
        ))}
      </div>
      <div className="processes-container" >
        {/* Processes */}
        {processes.map((process) => (
          <Process
            key={process.pid}
            pid={process.pid}
            arrivalTime={process.arrivalTime}
            burstTime={process.burstTime}
            color={process.color}
            parWidth={processParWidth}
          />
        ))}
      </div>
      <div className="time-axis">
        Time
      </div>
    </div>
  );
};
export default ChartScheduling;
