import React, { useState } from 'react';
// 
const LengthConversionFactors = {
  "mm" : {
    "cm": 0.1,
    "inch": 0.03937,
    "foot": 0.00328,
    "yard": 0.00109,
    "meter": 0.001,
    "mile": 0.0000006214,
    "km": 0.000001
  },
  "cm" : {
    "mm": 10,
    "inch": 0.394,
    "foot": 0.033,
    "yard": 0.011,
    "meter": 0.01,
    "mile": 0.0000062,
    "km": 0.00001
  },
  "inch" : {
    "mm": 25.40,
    "cm": 2.54,
    "foot": 0.08333,
    "yard": 0.02777,
    "meter": 0.0254,
    "mile": 0.000016,
    "km": 0.000025
  },
  "foot" : {
    "mm": 304.8,
    "cm": 30.48,
    "inch": 11.9999,
    "yard": 0.33333,
    "meter": 0.3048,
    "mile": 0.000189,
    "km": 0.000305
  },
  "yard" : {
    "mm": 914.4,
    "cm": 91.44,
    "inch": 35.999,
    "foot": 2.9999,
    "meter": 0.9144,
    "mile": 0.000568,
    "km": 0.000914
  },
  "meter" : {
    "mm": 1000,
    "cm": 100,
    "inch": 39.37,
    "foot": 3.281,
    "yard": 1.094,
    "mile": 0.0006214,
    "km": 0.001
  },
  "mile" : {
    "mm": 1609269.39,
    "cm": 160926.94,
    "inch": 63357.06,
    "foot": 5279.76,
    "yard": 1759.92,
    "meter": 1609.27,
    "km": 1.609
  },
  "km" : {
    "mm": 1000000,
    "cm": 100000,
    "inch": 39370.08,
    "foot": 3280.84,
    "yard": 1093.613,
    "meter": 1000,
    "mile": 0.6214
  }
}
const LengthCalc = () => {
  const [LengthUnitDetails, setLengthUnitDetails] = useState({
    From: "Select",
    To: "Select"
  });
  // 
  function calculateLengthValue() {
    
  }
  return (
    <div className='LengthCalc-Container'>
      <b>Length Calculator</b>
      <div className='Length-Selectors'>
        <div>
          <input type="number" name="" id="" placeholder='Enter Value' />
          <select>
            <option value="Select">Select</option>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="inch">inch</option>
            <option value="foot">foot</option>
            <option value="yard">yard</option>
            <option value="m">meter</option>
            <option value="km">km</option>
          </select>
        </div>
        <div>
          <input type="number" name="" id="" placeholder='Enter Value' />
          <select>
            <option value="Select">Select</option>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="inch">inch</option>
            <option value="foot">foot</option>
            <option value="yard">yard</option>
            <option value="m">meter</option>
            <option value="km">km</option>
          </select>
        </div>
      </div>
      <button>Calculate</button>
    </div>
  )
}
// 
export default LengthCalc;