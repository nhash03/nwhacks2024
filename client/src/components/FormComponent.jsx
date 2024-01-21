// src/components/FormComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './FormComponent.css';
import BackgroundImage from './search.jpg';


const FormComponent = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleApi =  async(e) => {
    e.preventDefault();

    try{
      const formData = new FormData();
      formData.append('text', text);
      formData.append('image', image);
      const response = await axios.post('http://localhost:8080/api/analyze', formData);
      console.log(response.data.message);
      localStorage.setItem("key", response.data.message);
    } catch(error) {
      console.log('error');
    }
    navigate('/options');
  };

  return (
    <div style={{ backgroundImage: `url('search.jpg')` }}>
      <form className='form'>
        <div >
          <label htmlFor="text" id = 'form-text'>Your Personal Info:</label>
          <input type="text" id="form-text-space" value={text} onChange={handleTextChange} />
        </div>
        <div>
          <label htmlFor="image" id='medical-text'>Medical Lab Report:</label>
          <input type="file" id="medical-image" onChange={handleImageChange} />
        </div>
        <button type="submit" onClick={handleApi} id = 'submit-but'>
          Submit</button>
      </form>
    </div>
  );
};

export default FormComponent;
