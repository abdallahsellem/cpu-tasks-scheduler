import React,{useState} from 'react';
import ChartScheduling from './components/ChartScheduling';
import FormPage from "./pages/FormPage"
import VisualizationPage from "./pages/VisualizationPage"
import { MyContextProvider, useMyContext } from './context/TasksData';
import { FIFO } from './helpers/FCFS'; // Adjust the path if necessary

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
const tasksData = [{ taskid: 1, releaseTime: 4, period: 6, executionTime: 2, deadLine: 10, priority: 1 }
  , { taskid: 2, releaseTime: 4, period: 10, executionTime: 6, deadLine: 12, priority: 6 }
  , { taskid: 3, releaseTime: 0, period: 7, executionTime: 8, deadLine: 20, priority: 2 }]
const App = () => {
  return (
    <MyContextProvider>
      {console.log(FIFO(tasksData))}
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage></FormPage>} />
        <Route path="/visualization-page" element={<VisualizationPage></VisualizationPage>} />

      </Routes>
    </BrowserRouter>
    </div>
    </MyContextProvider>

  );
};

export default App;
