import React from 'react';
import Process from './Process';
import './Scheduler.css'; // Import CSS file for styling

const ChartScheduling = ({ processes }) => {
  const maxTime = processes.reduce((acc, process) => Math.max(acc, process.arrivalTime + process.burstTime), 0);

  return (
<div className="scheduler-container">
      <div className="timeline-container">
        {/* Timeline */}
        {[...Array(maxTime + 1).keys()].map((time) => (
          <div key={time} className="timeline">
            {time}
          </div>
        ))}
      </div>
      <div className="processes-container">
        {/* Processes */}
        {processes.map((process) => (
          <Process
            key={process.pid}
            pid={process.pid}
            arrivalTime={process.arrivalTime}
            burstTime={process.burstTime}
            color={process.color}
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
