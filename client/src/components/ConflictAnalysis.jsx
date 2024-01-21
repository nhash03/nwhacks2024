import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const DrugConflict = () => {
    const [data, setData] = React.useState([]);
    const [food_data, setFoodData] = React.useState([]);

    useEffect(() => {
        var drug_num = '';
        var drug_name = '';
        var drug_list = [];
        for (let i = 0; i < localStorage.getItem('drug_count'); i++) {
            drug_num = `drug_${i}`
            drug_name = localStorage.getItem(drug_num);
            drug_list.push(drug_name);
        console.log(drug_num)
        console.log(drug_name)

        }
        console.log(drug_list)
        
        axios.post('http://localhost:8080/api/drug_conflict', {drug_list}).then((res) => {
            const drug_conflict_message = res.data.message;
            console.log(res);
            console.log(drug_conflict_message);
            setData(drug_conflict_message);
        })
        
        axios.post('http://localhost:8080/api/food_conflict', {drug_list}).then((res) => {
            const food_conflict_message = res.data.message;
            console.log(res);
            console.log(food_conflict_message);
            setFoodData(food_conflict_message);
        })

    })

    
    
    return (
        <div>
        <h3>{data}</h3>
        <p>{food_data }</p>
        </div>
    );
};

export default DrugConflict;