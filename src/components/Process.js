import React from 'react';

const Process = ({ pid, arrivalTime, burstTime, color }) => {
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
    width: `${burstTime * barWidth}px`, // Adjust width based on burst time
    left: `${arrivalTime * barWidth}px`, // Adjust position based on arrival time
    top: `${pid * 40}px`, // Adjust position based on process ID
  };

  return (
    <div style={style}>
      P{pid}
    </div>
  );
};

export default Process;
