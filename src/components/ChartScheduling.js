import React from 'react';
import Process from './Process';

const ChartScheduling = ({ processes }) => {
  const maxTime = processes.reduce((acc, process) => Math.max(acc, process.arrivalTime + process.burstTime), 0);
  const containerStyle = {
    position: 'relative',
    height: `${(processes.length + 1) * 40}px`, // Adjust height based on number of processes
    border: '1px solid black',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      {processes.map((process) => (
        <Process
          key={process.pid}
          pid={process.pid}
          arrivalTime={process.arrivalTime}
          burstTime={process.burstTime}
          color={process.color}
        />
      ))}
      <div style={{ position: 'absolute', top: '0', left: '0', width: `${maxTime * 40}px`, height: '100%' }}>
        {/* Timeline */}
        {[...Array(maxTime + 1).keys()].map((time) => (
          <div key={time} style={{ position: 'absolute', left: `${time * 40}px`, height: '100%', borderLeft: '1px solid #ccc' }}>
            {time}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartScheduling;
