import axios from 'axios';
import { FaExchangeAlt } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
// 
const CurrencyCalc = () => {
    const [AllCountries, setAllCountries] = useState([]);
    const [DropDownOptions, setDropDownOptions] = useState({
        FromCountry: "",
        ToCountry: ""
    });
    const [CurrencyAmount, setCurrencyAmount] = useState(1);
    const [ExchangeRateResult, setExchangeRateResult] = useState("");
    // getting All Countries 
    const { data: allCountriesResponse, isFetched: isFetchedAllCountries } = useQuery({
        queryKey: ["getCurrencies"],
        queryFn: async() => {
            const data = await axios.get('https://api.frankfurter.app/currencies');
            return data;
        },
        retry: false
    });
    useEffect(()=> {
        if(isFetchedAllCountries) {
            setAllCountries(Object.keys(allCountriesResponse?.data));
        }
    }, [isFetchedAllCountries]);
    // getting selected Countries Currency rates
    const { data: CurrencyRateResponse, refetch, isFetched: isFetchedCurrencyRate } = useQuery({
        queryKey: ["getCurrencyRates"],
        queryFn: async () => {
            const data = await axios.get(`https://api.frankfurter.app/latest?amount=${CurrencyAmount}&from=${DropDownOptions.FromCountry}&to=${DropDownOptions.ToCountry}`);
            return data;
        },
        retry: false,
        enabled: false
    });
    useEffect(() => {
        if(isFetchedCurrencyRate) {
            setExchangeRateResult(`${CurrencyRateResponse?.data?.rates[DropDownOptions.ToCountry]} ${DropDownOptions.ToCountry}`)
        }
    }, [isFetchedCurrencyRate, CurrencyRateResponse]);
    return (
        <div className='CurrencyCalc-Container'>
            <div className='DropDownLabels'>
                <b>From</b>
                <FaExchangeAlt style={{marginRight: "18px"}} />
                <b>To</b>
            </div>
            <div className="dropDown-Container">
                <select name="FromCountry" id="DropDown1" onChange={(e)=> setDropDownOptions(prevData => ({ ...prevData, [e.target.name]: e.target.value }))}>
                    <option value="Default">Select</option>
                    {
                        allCountriesResponse && 
                        AllCountries.map((eachCountry, id1)=> (
                            <option value={eachCountry} key={id1}>{eachCountry}</option>
                        ))
                    }
                </select>
                <select name="ToCountry" id="DropDown2"  onChange={(e)=> setDropDownOptions(prevData => ({ ...prevData, [e.target.name]: e.target.value }))}>
                    <option value="Default">Select</option>
                    {
                        allCountriesResponse && 
                        AllCountries.map((eachCountry, id1)=> (
                            <option value={eachCountry} key={id1}>{eachCountry}</option>
                        ))
                    }
                </select>
            </div>
            <div className='CurrencyCalc-Input-Section'>
                <input type="number" name='Currency-Input' id='Currency-Input' placeholder='Enter Value' onChange={(e) => setCurrencyAmount(e.target.value)} />
            </div>
            <strong>
                {
                    ExchangeRateResult ? ExchangeRateResult : "None"
                }
            </strong>
            <button className='Calc-Currency-Btn' onClick={() => refetch()}>Calculate</button>
        </div>
    );
}
// 
export default CurrencyCalc;