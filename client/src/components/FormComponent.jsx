// src/components/FormComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import useNavigate from 'react-router-dom';


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
    <form >
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
