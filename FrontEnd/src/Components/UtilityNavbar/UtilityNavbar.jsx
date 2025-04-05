import React from 'react';
import './UtilityNavbar.css';
import { FaBorderStyle, FaCalculator, FaCube, FaDollarSign, FaEdit, FaRuler, FaThermometerHalf, FaTimes, FaWeight } from 'react-icons/fa';
// 
const UtilityNavbar = React.memo(({ setUtilityNavbarFlag }) => {
    return (
        <nav className='UtilityNavBar-Container'>
            <span onClick={() => setUtilityNavbarFlag(false)}>
                <FaTimes />
            </span>
            <section>
                <div>
                    <FaCalculator />
                    <b>
                        Calculator
                    </b>
                </div>
                <div>
                    <FaEdit />
                    <b>
                        Notes
                    </b>
                </div>
                <div>
                    <FaDollarSign />
                    <b>
                        Currency
                    </b>
                </div>
                <div>
                    <FaWeight />
                    <b>
                        BMI
                    </b>
                </div>
                <div>
                    <FaThermometerHalf />
                    <b>
                        Temperature
                    </b>
                </div>
                <div>
                    <FaRuler />
                    <b>
                        Length
                    </b>
                </div>
                <div>
                    <FaCube />
                    <b>
                        Volume
                    </b>
                </div>
                <div>
                    <FaBorderStyle />
                    <b>
                        Area
                    </b>
                </div>
            </section>
        </nav>
    )
});
// 
export default UtilityNavbar;