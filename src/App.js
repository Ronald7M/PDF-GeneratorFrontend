
import './App.css';
import GeneratePDF from './GeneratePDF';
import History from './History';
import React, { useState } from 'react';

function App() {
  const[value,setValue]=useState("form");
  const handlerClick=(event)=>{
      setValue(event.target.name);
  }

  return (
    <div className="App">
        <div className='but'>
          <button name='form' className={value === 'form'? "active": ""} onClick={handlerClick}>Form</button>
          <button name='history' className={value === 'history'? "active": ""} onClick={handlerClick}>History</button>
        </div>
        {value === 'form'? <GeneratePDF ></GeneratePDF>:''}
        {value === 'history'? <History ></History>:''}
        
    </div>
  );
}

export default App;
