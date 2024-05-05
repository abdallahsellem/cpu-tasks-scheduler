import React, { useEffect } from 'react'
import styling from "./index.module.scss"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function FormPage() {
    const [algorithmType, setAlgorithmType] = React.useState('');
    const [numberOfTasks, setNumberOfTasks] = React.useState(1);
    const [tasksData, setTasksData] = React.useState([{releaseTime:0,period:0,executionTime:0,deadLine:0,priority:0}]);


    const handleChangeSelect = (event) => {
        setAlgorithmType(event.target.value);
    };
    const handleChangeTasks = (event) => {
        console.log(event.target.value)
        setNumberOfTasks(event.target.value);
    };
    const handleChangeTasksInfo = (index,value,field) => {
        const updatedTasksData = [...tasksData];
        updatedTasksData[index] = { ...updatedTasksData[index], [field]:Number(value) };
        setTasksData(updatedTasksData);
        
    };
    
    useEffect(()=>{
        const initialTasksData = Array.from({ length: numberOfTasks }, () => ({ releaseTime: 0, period: 0, executionTime: 0, deadLine: 0, priority: 0 }));
        setTasksData(initialTasksData);
    },[numberOfTasks])
    return (
        <div id={styling.Page}>
            <div id={styling.InfoContainer}>
                <TextField
                    required
                    id="outlined-required"
                    label="Required"
                    defaultValue={1}
                    type='number'
                    onChange={handleChangeTasks}
                />
                <FormControl sx={{ width: "200px" }}>
                    <InputLabel id="Algorithm Type-select-label">Algorithm Type</InputLabel>
                    <Select
                        labelId="Algorithm Type-select-label"
                        id="Algorithm Type-select"
                        value={algorithmType}
                        label="Algorithm Type"
                        onChange={handleChangeSelect}
                    >
                        <MenuItem value={"FCFS"}>FCFS</MenuItem>
                        <MenuItem value={"RR"}>RR</MenuItem>
                        <MenuItem value={"LED"}>LED</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div id={styling.TasksContainer}>
                {<>{console.log(tasksData)}</>}
                {
                Array.from({ length: numberOfTasks }).map((val,index)=>{
                    return <div key={index}>
                <TextField
                    required
                    id="Release Time"
                    label="Release Time"
                    defaultValue={0}
                    type='number'
                    onChange={e => handleChangeTasksInfo(index, e.target.value,"releaseTime")}
                    
                />
                <TextField
                    required
                    id="Period"
                    label="Period"
                    defaultValue={0}
                    type='number'
                    onChange={e => handleChangeTasksInfo(index, e.target.value,"period")}
                />
                <TextField
                    required
                    id="Execution Time"
                    label="Execution Time"
                    defaultValue={0}
                    type='number'
                    onChange={e => handleChangeTasksInfo(index, e.target.value,"executionTime")}
                />
                <TextField
                    required
                    id="Deadline"
                    label="Deadline"
                    defaultValue={0}
                    type='number'
                    onChange={e => handleChangeTasksInfo(index, e.target.value,"deadLine")}
                />
                <TextField
                    required
                    id="Priority"
                    label="Priority"
                    defaultValue={0}
                    type='number'
                    onChange={e => handleChangeTasksInfo(index, e.target.value,"priority")}
                />
                </div>
                })
            }
            </div>
            <div id={styling.maximumTimeContainer}> <TextField
                    required
                    id="Maximum Time"
                    label="Maximum Time"
                    defaultValue={0}
                    type='number'
                    onChange={e => handleChangeTasksInfo(e.target.value)}
                /></div>

        </div>
    )
}

export default FormPage