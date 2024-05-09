import React,{useState} from 'react';
import ChartScheduling from './components/ChartScheduling';
import FormPage from "./pages/FormPage"
import VisualizationPage from "./pages/VisualizationPage"
import { MyContextProvider, useMyContext } from './context/TasksData';
import { rateMonotonicSchedulingRma } from './helpers/rma'; // Adjust the path if necessary

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
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
