import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../designs/PillForm.css'; 
import {useNavigate} from 'react-router-dom';


const DrugPortal = () => {
  const [pillList, setPillList] = useState([{ name: '', time: null }]);
    const navigate = useNavigate();

  const handleAddPill = () => {
    setPillList([...pillList, { name: '', time: null }]);
  };

  const handleRemovePill = (index) => {
    const updatedPillList = [...pillList];
    updatedPillList.splice(index, 1);
    setPillList(updatedPillList);
  };

  const handlePillNameChange = (index, value) => {
    const updatedPillList = [...pillList];
    updatedPillList[index].name = value;
    setPillList(updatedPillList);
  };

  const handleTimeChange = (index, time) => {
    const updatedPillList = [...pillList];
    updatedPillList[index].time = time;
    setPillList(updatedPillList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send pill data to the backend or perform further processing
    console.log(pillList);
  };

  const handleNext = () => {
    pillList.forEach((pill, index) => {
      localStorage.setItem(`drug_${index}`, pill.name);
    });
    localStorage.setItem("drug_count", pillList.length);
    navigate('/conflict_analysis');
  };

  return (
    <form className="pill-form" onSubmit={handleSubmit}>
      <h2>Pill Reminder</h2>
      {pillList.map((pill, index) => (
        <div key={index} className="pill-entry">
          <input
            type="text"
            placeholder="Pill Name"
            value={pill.name}
            onChange={(e) => handlePillNameChange(index, e.target.value)}
          />
          <DatePicker
            selected={pill.time}
            onChange={(time) => handleTimeChange(index, time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Select Time"
          />
          {index > 0 && (
            <button type="button" onClick={() => handleRemovePill(index)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddPill}>
        Add Pill
      </button>
      <button type="submit" onClick={handleNext}>Submit</button>
    </form>
  );
};

export default DrugPortal;
