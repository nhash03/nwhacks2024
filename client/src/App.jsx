// src/App.js
import React, { useState } from 'react';
import FormComponent from './components/FormComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Options from './components/Options';


const App = () => {

  return (
      <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path='/' element={<FormComponent />}/>
            <Route path='/options' element={<Options />}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
