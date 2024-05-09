import React,{useState} from 'react';
import ChartScheduling from './components/ChartScheduling';
import FormPage from "./pages/FormPage"
import VisualizationPage from "./pages/VisualizationPage"
import { MyContextProvider, useMyContext } from './context/TasksData';
import { FIFO } from './helpers/FCFS'; // Adjust the path if necessary
import {runMinimumLaxity} from "./helpers/MLT"
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
const tasksData =[
  {taskid : 1 ,releaseTime: 0, period: 4, executionTime: 1.5, deadLine: 4 },
  {taskid : 2 ,releaseTime: 0, period: 10, executionTime: 3, deadLine: 10 },
  {taskid : 3 ,releaseTime: 0, period: 12, executionTime: 3, deadLine: 12 },
]

 const data =  runMinimumLaxity(tasksData , 28)
 console.log(data)
const App = () => {
  return (
    <MyContextProvider>
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