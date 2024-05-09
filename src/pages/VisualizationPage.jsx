import React, { useEffect } from 'react'
import {useMyContext} from "../context/TasksData"
import ChartScheduling from "../components/ChartScheduling"
function VisualizationPage() {
  const Context=useMyContext()
  useEffect(()=>{},[Context.tasks])
  return (
      
    <div>{console.log(Context.tasks)}<ChartScheduling  ></ChartScheduling></div>
  )
}

export default VisualizationPage