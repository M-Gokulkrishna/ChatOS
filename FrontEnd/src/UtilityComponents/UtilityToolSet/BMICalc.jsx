import React, { useState } from 'react';
// 
const BMICalc = () => {
  const [BMIDetails, setBMIDetails] = useState({
    Weight: null,
    Height: null
  });
  const [BMIResult, setBMIResult] = useState("");
  // 
  function calculateBMI() {
    const BMIValue = parseFloat(String((BMIDetails.Weight / ((BMIDetails.Height / 100) ** 2))).slice(0, 5));
    if(BMIValue < 18.5) {
      setBMIResult(`${BMIValue} UnderWeight`);
    }
    else if(BMIValue >= 18.5 && BMIValue < 25) {
      setBMIResult(`${BMIValue} Normal`);
    }
    else if(BMIValue >= 25 && BMIValue < 30) {
      setBMIResult(`${BMIValue} OverWeight`);
    }
    else if(BMIValue >= 30 && BMIValue < 35) {
      setBMIResult(`${BMIValue} Obesity Class-1`);
    }
    else if(BMIValue >= 35 && BMIValue < 40) {
      setBMIResult(`${BMIValue} Obesity Class-2`);
    }
    else if(BMIValue >= 40) {
      setBMIResult(`${BMIValue} Obesity Class-3`);
    }
  }
  return (
    <div className='BMICalc-Container'>
      <b>BMI Calculator</b>
      <input type="number" name="Weight" id="Weight-Input" placeholder='Weight (Kg)' onChange={(e) => setBMIDetails(prevDate => ({...prevDate, [e.target.name]: e.target.value }))} />
      <input type="number" name="Height" id="Height-Input" placeholder='Height (Cm)' onChange={(e) => setBMIDetails(prevDate => ({...prevDate, [e.target.name]: e.target.value }))} />
      <strong>{BMIResult || "None"}</strong>
      <button onClick={calculateBMI}>Calculate</button>
    </div>
  );
}
// 
export default BMICalc;