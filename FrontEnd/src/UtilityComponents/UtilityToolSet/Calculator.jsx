import './UtilityToolSet.css';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { FaBackspace } from 'react-icons/fa';
// 
const Calculator = () => {
	const [CalculationString, setCalculationString] = useState("");
	// 
	function handleCalculation(Value) {
		if (Value === "CE") {
			setCalculationString("");
			return;
		}
		if (Value === "Undo") {
			setCalculationString(prevString => prevString.slice(0, prevString.length - 1));
			return;
		}
		if (Value === "=") {
			if (typeof (parseInt(CalculationString.at(-1))) === "number") {
				setCalculationString(String(eval(CalculationString)));
				return;
			}
			else {
				toast.warn("Enter Valid Calculation!");
				return;
			}
		}
		setCalculationString(prevString => prevString + Value);
	}
	// 
	return (
		<div className='Calculator-Container'>
			<button className='Dispatch-Btn'>Dispatch</button>
			<p>{CalculationString}</p>
			<div className="Calculator-Btns-Container">
				<button onClick={() => handleCalculation("CE")}>CE</button>
				<button onClick={() => handleCalculation("%")}>%</button>
				<button onClick={() => handleCalculation("Undo")}>
					<u>
						<FaBackspace />
					</u>
				</button>
				<button onClick={() => handleCalculation("/")}>/</button>
				<button onClick={() => handleCalculation("7")}>7</button>
				<button onClick={() => handleCalculation("8")}>8</button>
				<button onClick={() => handleCalculation("9")}>9</button>
				<button onClick={() => handleCalculation("*")}>X</button>
				<button onClick={() => handleCalculation("4")}>4</button>
				<button onClick={() => handleCalculation("5")}>5</button>
				<button onClick={() => handleCalculation("6")}>6</button>
				<button onClick={() => handleCalculation("-")}>_</button>
				<button onClick={() => handleCalculation("1")}>1</button>
				<button onClick={() => handleCalculation("2")}>2</button>
				<button onClick={() => handleCalculation("3")}>3</button>
				<button onClick={() => handleCalculation("+")}>+</button>
				<button onClick={() => handleCalculation("00")}>00</button>
				<button onClick={() => handleCalculation("0")}>0</button>
				<button onClick={() => handleCalculation(".")}>.</button>
				<button onClick={() => handleCalculation("=")}>=</button>
			</div>
		</div>
	)
}
// 
export default Calculator;