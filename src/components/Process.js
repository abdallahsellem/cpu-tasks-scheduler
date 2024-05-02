import React from 'react';

const Process = ({ pid, arrivalTime, burstTime, color }) => {
  const style = {
    backgroundColor: color,
    border: '1px solid black',
    height: '30px',
    lineHeight: '30px',
    position: 'absolute',
    textAlign: 'center',
    width: `${burstTime * 40}px`, // Adjust width based on burst time
    left: `${arrivalTime * 40}px`, // Adjust position based on arrival time
    top: `${pid * 40}px`, // Adjust position based on process ID
  };

  return (
    <div style={style}>
      P{pid}
    </div>
  );
};

export default Process;
