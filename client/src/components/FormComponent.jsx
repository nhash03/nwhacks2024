// src/components/FormComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import BounceLoader from "react-spinners/BounceLoader";


const FormComponent = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/api/analyze', formData);
      setIsLoading(false);
      console.log(response.data.message);
      localStorage.setItem("key", response.data.message);
    } catch(error) {
      setIsLoading(false);
      console.log('error');
    }
    navigate('/options');
  };

  return (
    <form >
      <div>
        {isLoading ? <p>currently loading</p> : null}
        <BounceLoader
          loading={isLoading}
          size={60}
          color='blue'
        />
      </div>
      <div>
        <label htmlFor="text">Text:</label>
        <input type="text" id="text" value={text} onChange={handleTextChange} />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} />
      </div>
      <button type="submit" onClick={handleApi}>
        Submit</button>
    </form>
  );
};

export default FormComponent;
