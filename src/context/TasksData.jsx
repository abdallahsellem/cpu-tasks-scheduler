import { createContext, useContext, useState } from 'react';

const MyContext = createContext({
  tasks: [{}],
  setTracks: () => [{}],
  maxTime: 0 ,// Add the maxTime field with initial value 0
  setMaxTime:()=>Number
});

export const MyContextProvider = ({ children }) => {
  const [maxTime, setMaxTime] = useState(0);
  const [tasks, setTracks] = useState([{}]);

  const contextValue = {
    tasks,
    setTracks,
    maxTime,
    setMaxTime
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
