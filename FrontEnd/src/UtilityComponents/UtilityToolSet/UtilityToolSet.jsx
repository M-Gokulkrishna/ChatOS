
import './UtilityToolSet.css';
import React, { useState } from 'react';
import NotesTool from '../Notes/NotesTool';
import Calculator from '../Calculator/Calculator';
import { useOutletContext } from 'react-router-dom';
import { FaBorderStyle, FaCalculator, FaCube, FaDollarSign, FaEdit, FaRuler, FaThermometerHalf, FaTimes, FaWeight } from 'react-icons/fa';

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
                !UtilityTool &&
                <section>
                    <div onClick={() => setUtilityTool("Calculator")}>
                        <FaCalculator />
                        <b>
                            Calculator
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Notes")}>
                        <FaEdit />
                        <b>
                            Notes
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Currency")}>
                        <FaDollarSign />
                        <b>
                            Currency
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("BMI")}>
                        <FaWeight />
                        <b>
                            BMI
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Temperature")}>
                        <FaThermometerHalf />
                        <b>
                            Temperature
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Length")}>
                        <FaRuler />
                        <b>
                            Length
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Volume")}>
                        <FaCube />
                        <b>
                            Volume
                        </b>
                    </div>
                    <div onClick={() => setUtilityTool("Area")}>
                        <FaBorderStyle />
                        <b>
                            Area
                        </b>
                    </div>
                </section>
            }
            {
                UtilityTool === "Calculator" &&
                <Calculator />
            }
            {
                UtilityTool === "Notes" &&
                <NotesTool />
            }
            {
                UtilityTool === "Currency" &&
                <NotesTool />
            }
        </div>
    )
});
// 
export default UtilityNavbar;