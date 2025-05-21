import React, { useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
// 
const TemperatureCalc = () => {
    const TemperatureInputRef = useRef(null);
    const [TemperatureResult, setTemperatureResult] = useState("");
    const [TemperatureOptionState, setTemperatureOptionState] = useState({
        From: "Select",
        To: "Select"
    });
    // 
    function calculateTemperature(){
        const TemperatureValue = parseFloat(TemperatureInputRef.current.value);
        if (TemperatureOptionState.From === "Select" || TemperatureOptionState.To === "Select") {
            toast.warn("Select valid Temperature unit!");
            return;
        }
        else if(TemperatureOptionState.From === TemperatureOptionState.To) {
            setTemperatureResult(`${TemperatureValue}${TemperatureOptionState.From}*`);
        }
        else {
            let CalculatedTemperature = '';
            if (TemperatureOptionState.From === "C" && TemperatureOptionState.To === "F") {
                CalculatedTemperature = (`${String((TemperatureValue * (9 / 5)) + 32)}`);
            }
            else if (TemperatureOptionState.From === "C" && TemperatureOptionState.To === "K") {
                CalculatedTemperature = (`${String(TemperatureValue + 273.15)}`);
            }
            else if (TemperatureOptionState.From === "F" && TemperatureOptionState.To === "C") {
                CalculatedTemperature = (`${String((TemperatureValue - 32) * (5 / 9))}`);
            }
            else if (TemperatureOptionState.From === "F" && TemperatureOptionState.To === "K") {
                CalculatedTemperature = (`${String((TemperatureValue - 32) * (5 / 9) + 273.15)}`);
            }
            else if (TemperatureOptionState.From === "K" && TemperatureOptionState.To === "C") {
                CalculatedTemperature = (`${String(TemperatureValue - 273.15)}`);
            }
            else if (TemperatureOptionState.From === "K" && TemperatureOptionState.To === "F") {
                CalculatedTemperature = (`${String((TemperatureValue - 273.15) * (9 / 5) + 32)}`);
            }
            // 
            setTemperatureResult(
                CalculatedTemperature.includes(".") ?
                CalculatedTemperature.slice(0, 7) + " " + TemperatureOptionState.To + "*" :
                CalculatedTemperature + " " + TemperatureOptionState.To + "*"
            );
        }
    }
    return (
        <div className='TemperatureCalc-Container'>
            <b>Temperature Calculator</b>
            <div className='Options-Selector'>
                <select onChange={(e) => setTemperatureOptionState(previousData => ({...previousData, From: e.target.value}))}>
                    <option value="Select">Select</option>
                    <option value="C">C*</option>
                    <option value="F">F*</option>
                    <option value="K">K&nbsp;</option>
                </select>
                <FaArrowRight />
                <select  onChange={(e) => setTemperatureOptionState(previousData => ({...previousData, To: e.target.value}))}>
                    <option value="Select">Select</option>
                    <option value="C">C*</option>
                    <option value="F">F*</option>
                    <option value="K">K&nbsp;</option>
                </select>
            </div>
            <input type="number" placeholder='Enter Value' ref={TemperatureInputRef} />
            <strong>
                {TemperatureResult || "None"}
            </strong>
            <button onClick={calculateTemperature}>Calculate</button>
        </div>
    );
}
// 
export default TemperatureCalc;