// src/App.js
import React, { useState } from 'react';
import FormComponent from './components/FormComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Options from './components/Options';
import DrugPortal from './components/DrugPortal';
import DrugConflict from './components/ConflictAnalysis';


const App = () => {

  return (
      <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path='/' element={<FormComponent />}/>
            <Route path='/options' element={<Options />}/>
            <Route path='/drug_portal' element={<DrugPortal />}/>
            <Route path='/conflict_analysis' element= {<DrugConflict />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
