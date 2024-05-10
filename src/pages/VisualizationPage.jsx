import React, { useEffect } from 'react'
import {useMyContext} from "../context/TasksData"
import ChartScheduling from "../components/ChartScheduling"
import Chip from '@mui/material/Chip';
function VisualizationPage() {
  const Context=useMyContext()
  // useEffect(()=>{},[Context.tasks])
  return (
      
    <div><ChartScheduling  ></ChartScheduling>
        {
          Object.keys(Context?.deadLine||{})?.length===0?<></>:
         <div style={{display:'flex',justifyContent:"center",border:"solid 2px "}}><h4>JOB {Context.deadLine.taskid+1},{Context.deadLine.jobid+1} break deadline at : {Context.deadLine.time} </h4> </div>
        }
    </div>
  )
}

export default VisualizationPage