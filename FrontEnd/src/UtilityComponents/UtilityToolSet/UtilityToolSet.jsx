import React from 'react';
import './UtilityToolSet.css';
import Calculator from '../Calculator/Calculator';
import { FaBorderStyle, FaCalculator, FaCube, FaDollarSign, FaEdit, FaRuler, FaThermometerHalf, FaTimes, FaWeight } from 'react-icons/fa';
import NotesTool from '../Notes/NotesTool';
// 
const UtilityNavbar = React.memo(({ UtilityTool, setUtilityTool }) => {
    return (
        <nav className='UtilityNavBar-Container'>
            <span onClick={() => setUtilityTool("Disable")}>
                <FaTimes />
            </span>
            {
                UtilityTool === "Enable" &&
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
                UtilityTool === "Notes" &&
                <NotesTool />
            }
        </nav>
    )
});
// 
export default UtilityNavbar;