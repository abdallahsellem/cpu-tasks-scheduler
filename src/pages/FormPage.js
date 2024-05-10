import React, { useEffect } from 'react'
import styling from "./index.module.scss"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useMyContext } from "../context/TasksData"
import { useNavigate } from "react-router-dom";
import { FIFO } from '../helpers/FCFS'; // Adjust the path if necessary
import { schedulePeriodicRR } from '../helpers/RR'; // Adjust the path if necessary
import { RMA } from '../helpers/RMA'; 
import { DMA } from '../helpers/DMA'; 
import { runMinimumLaxity } from '../helpers/MLT';
import { schedulePeriodicEDF } from '../helpers/EDF';


function FormPage() {
    const { setMaxTime, setTracks,setDeadLine } = useMyContext();
    const [algorithmType, setAlgorithmType] = React.useState('');
    const [numberOfTasks, setNumberOfTasks] = React.useState(1);
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [isDisabledQuantum, setIsDisabledQuantum] = React.useState(true);
    const [quantumTime, setQuantumTime] = React.useState(1);

    const [tasksData, setTasksData] = React.useState({ maxTime: 0, data: [{ taskid: -1, releaseTime: 0, period: 0, executionTime: 0, deadLine: 0, priority: 0 }] });
    const navigate = useNavigate();

    const handleChangeSelect = (event) => {
        setAlgorithmType(event.target.value);
        if(event.target.value==="MLT"||event.target.value==="RMA")
            {
                setIsDisabled(true) ;
            }
            else{
                setIsDisabled(false) ;
            }

            if(event.target.value==="RR"||event.target.value==="EDF")
                {
                    setIsDisabledQuantum(false) ;
                }
                else{
                    setIsDisabledQuantum(true) ;
                }
            
    };
    const handleChangeTasks = (event) => {
        setNumberOfTasks(event.target.value);
    };
    const handleChangeTasksInfo = (index, value, field) => {
        // Create a copy of tasksData
        const updatedTasksData = [...tasksData.data];


        // Update the specific task's field
        updatedTasksData[index][field] = Number(value);
        updatedTasksData[index]["taskid"] = index

        // Update the state with the updated tasksData
        setTasksData(prevState => ({
            ...prevState,
            data: updatedTasksData
        }));
    }

    const handleMaxTime = (value) => {
        const updatedTasksData = tasksData;
        updatedTasksData.maxTime = Number(value);

        setTasksData(updatedTasksData);

    };
    
    const handleQuantumTime = (value) => {
        setQuantumTime(Number(value))
    }
    const handleTasksOrder = () => {
        if(algorithmType==="")
            {
                return  ;
            }
        let orderedTasks=[];
        if (algorithmType === "FCFS") {
            orderedTasks=FIFO(tasksData.data,tasksData.maxTime)
        }
        else if (algorithmType === "RR") {
            orderedTasks= schedulePeriodicRR(tasksData.data,tasksData.maxTime,quantumTime)
        }
        else if (algorithmType === "MLT") {
            orderedTasks=runMinimumLaxity(tasksData.data,tasksData.maxTime)
        }
        else if (algorithmType === "DMA") {
            orderedTasks=DMA(tasksData.data,tasksData.maxTime)

        }
        else if (algorithmType === "RMA") {
            orderedTasks=RMA(tasksData.data,tasksData.maxTime)
        }
        else if (algorithmType === "EDF") {
            orderedTasks=schedulePeriodicEDF(tasksData.data,tasksData.maxTime,quantumTime);
        }
        setTracks(orderedTasks?orderedTasks.processes:[]);
        setMaxTime(tasksData.maxTime)
        setDeadLine(orderedTasks.brokendeadline)
        navigate("/visualization-page")

    };
    useEffect(() => {
        const initialTasksData = { maxTime: 0, data: Array.from({ length: numberOfTasks }, () => ({ taskid: -1, releaseTime: 0, period: 0, executionTime: 0, deadLine: 0, priority: 0 })) };
        setTasksData(initialTasksData);
    }, [numberOfTasks])
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
                        <MenuItem value={"MLT"}>MLT</MenuItem>
                        <MenuItem value={"RMA"}>RMA</MenuItem>
                        <MenuItem value={"EDF"}>EDF</MenuItem>
                        <MenuItem value={"DMA"}>DMA</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div id={styling.TasksContainer}>
                {
                    Array.from({ length: numberOfTasks }).map((val, index) => {
                        return <div key={index}>
                            <TextField
                                required
                                disabled={isDisabled}

                                id="Release Time"
                                label="Release Time"
                                defaultValue={0}
                                type='number'
                                onChange={e => handleChangeTasksInfo(index, e.target.value, "releaseTime")}

                            />
                            <TextField
                                required
                                id="Period"
                                label="Period"
                                defaultValue={0}
                                type='number'
                                onChange={e => handleChangeTasksInfo(index, e.target.value, "period")}
                            />
                            <TextField
                                required
                                id="Execution Time"
                                label="Execution Time"
                                defaultValue={0}
                                type='number'
                                onChange={e => handleChangeTasksInfo(index, e.target.value, "executionTime")}
                            />
                            <TextField
                                required
                                disabled={isDisabled}
                                id="Deadline"
                                label="Deadline"
                                defaultValue={0}
                                type='number'
                                onChange={e => handleChangeTasksInfo(index, e.target.value, "deadLine")}
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
                onChange={e => handleMaxTime(e.target.value)}
            />{isDisabledQuantum===false?<TextField
            required
            disabled={isDisabledQuantum}
            id="Quantum Time"
            label="Quantum Time"
            defaultValue={quantumTime}
            type='number'
            onChange={e => handleQuantumTime(e.target.value)}
        />:<></>}
        </div>
            <div style={{ marginTop: "20px" }}><Button variant="contained" sx={{ width: "150px", backgroundColor: "red" }} onClick={handleTasksOrder}>Visualize </Button></div>
        </div>
    )
}

export default FormPage