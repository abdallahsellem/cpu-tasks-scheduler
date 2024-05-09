import React from 'react';
import './Process.css'; // Import CSS file for styling and animation

const Process = ({ pid, arrivalTime, burstTime, color,parWidth,jobid }) => {
  const barWidth = 91; // Width of each time unit on the chart

  const style = {
    backgroundColor: color,
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    color: 'white',
    height: '30px',
    lineHeight: '30px',
    position: 'absolute',
    textAlign: 'center',
    width: `${burstTime * parWidth}px`, // Adjust width based on burst time
    left: `${arrivalTime * parWidth}px`, // Adjust position based on arrival time
    top: `${pid * 40}px`, // Adjust position based on process ID
  };

  return (
    <div className="process" style={style}>
      P{pid+1}{jobid}
    </div>
  );
};

export default Process;
