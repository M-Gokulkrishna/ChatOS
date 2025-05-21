import './UtilityToolSet.css';
import BMICalc from './BMICalc';
import AreaCalc from './AreaCalc';
import LengthCalc from './LengthCalc';
import Calculator from './Calculator';
import VolumeCalc from './VolumeCalc';
import React, { useState } from 'react';
import CurrencyCalc from './CurrencyCalc';
import TemperatureCalc from './TemperatureCalc';
import { useOutletContext } from 'react-router-dom';
import { FaArrowLeft, FaBorderStyle, FaCalculator, FaCloudSunRain, FaCube, FaDollarSign, FaEdit, FaRuler, FaThermometerHalf, FaTimes, FaWeight } from 'react-icons/fa';

// 
const UtilityNavbar = React.memo(() => {
    const { NavigateTo } = useOutletContext();
    const [UtilityTool, setUtilityTool] = useState("");
    return (
        <div className='UtilityNavBar-Container'>
            <span onClick={() => NavigateTo("/DashBoard")}>
                <FaTimes />
            </span>
            {
                UtilityTool &&
                <span onClick={() => setUtilityTool("")}>
                    <FaArrowLeft />
                </span>
            }
            {
                !UtilityTool &&
                <section>
                    <div onClick={() => setUtilityTool("Calculator")}>
                        <FaCalculator />
                        <b>
                            Calculator
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("CurrencyCalc")}>
                        <FaDollarSign />
                        <b>
                            Currency
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("BMICalc")}>
                        <FaWeight />
                        <b>
                            BMI
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("TemperatureCalc")}>
                        <FaThermometerHalf />
                        <b>
                            Temperature
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("LengthCalc")}>
                        <FaRuler />
                        <b>
                            Length
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("AreaCalc")}>
                        <FaBorderStyle />
                        <b>
                            Area
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("VolumeCalc")}>
                        <FaCube />
                        <b>
                            Volume
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Weather")}>
                        <FaCloudSunRain />
                        <b>
                            Weather
                        </b>
                    </div>
                </section>
            }
            {
                UtilityTool === "Calculator" &&
                <Calculator />
            }
            {
                UtilityTool === "CurrencyCalc" &&
                <CurrencyCalc />
            }
            {
                UtilityTool === "BMICalc" &&
                <BMICalc />
            }
            {
                UtilityTool === "TemperatureCalc" &&
                <TemperatureCalc />
            }
            {
                UtilityTool === "LengthCalc" &&
                <LengthCalc />
            }
            {
                UtilityTool === "AreaCalc" &&
                <AreaCalc />
            }
            {
                UtilityTool === "VolumeCalc" &&
                <VolumeCalc />
            }
            {
                UtilityTool === "Weather" &&
                <TemperatureCalc />
            }
        </div>
    )
});
// 
export default UtilityNavbar;