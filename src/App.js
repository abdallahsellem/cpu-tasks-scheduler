import React from 'react';
import ChartScheduling from './components/ChartScheduling';

const App = () => {
  const processes = [
    { pid: 1, arrivalTime: 0, burstTime: 5, color: 'blue' },
    { pid: 2, arrivalTime: 2, burstTime: 3, color: 'orange' },
    { pid: 3, arrivalTime: 4, burstTime: 2, color: 'green' },
    { pid: 4, arrivalTime: 6, burstTime: 4, color: 'red' },
    { pid: 1, arrivalTime: 9, burstTime: 10, color: 'blue' },
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>CPU Scheduler Visualization</h1>
      <ChartScheduling processes={processes} />
    </div>
  );
};

export default App;
