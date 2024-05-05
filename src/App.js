import React from 'react';
import ChartScheduling from './components/ChartScheduling';
import FormPage from "./pages/FormPage"
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
const App = () => {
  const processes = [
    { pid: 1, arrivalTime: 0, burstTime: 5, color: 'blue' },
    { pid: 2, arrivalTime: 2, burstTime: 3, color: 'orange' },
    { pid: 3, arrivalTime: 4, burstTime: 2, color: 'green' },
    { pid: 4, arrivalTime: 6, burstTime: 4, color: 'red' },
    { pid: 1, arrivalTime: 7, burstTime: 3, color: 'blue' },
    { pid: 1, arrivalTime: 12, burstTime: 3, color: 'blue' },
    { pid: 5, arrivalTime: 17, burstTime: 8, color: 'gray' },
    { pid: 6, arrivalTime: 17, burstTime: 8, color: 'black' },
    { pid: 7, arrivalTime: 17, burstTime: 8, color: '#735c33' },


  ];

  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage></FormPage>} />
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App;
