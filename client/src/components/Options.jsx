import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './options.css'


const Options = ( ) => {
    const navigate = useNavigate();

    const handleNext =  () => {
    navigate('/drug_portal');
  };

    const listItems = localStorage.getItem("hilo").split(",").map((s) => 
        <li>
            {s}
        </li>
    )

  return (
    <div id = 'issues'>
    <ul >
        <li id='bold'>
            A bit of health analysis...
        </li>
        {listItems}
    </ul>
    <p>
        {/* Based on your test results and personal information, it's possible that you have nutrition deficiencies. 
        Iron and folate deficiencis can cause high RDW. Additionally, high platelet count shows that your immune system
        is facing an emergency; infection and bone marrow disorders be one of the possible scenarios. Finally, drink water!
        Drinking less water than your need can cause nausa and may be the result of your low sodium level.
         */}
        {localStorage.getItem("key")}
    </p>
    <h4>
        I can help you even more...
    </h4>
    <button onClick={handleNext}>Drug Portal</button>
    </div>
  );
};

export default Options;
