import React, { useEffect } from 'react'
import {useMyContext} from "../context/TasksData"
import ChartScheduling from "../components/ChartScheduling"
import Chip from '@mui/material/Chip';
function VisualizationPage() {
  const Context=useMyContext()
  useEffect(()=>{},[Context.tasks])
  return (
      
    <div>{console.log(Context)}<ChartScheduling  ></ChartScheduling>
        {
          Object.keys(Context.deadLine).length===0?<></>:
         <div>task {Context.deadLine.taskid+1},{Context.deadLine.jopid+1} break deadline at : {Context.deadLine.time}  </div>
        }
    </div>
  )
}

export default VisualizationPage