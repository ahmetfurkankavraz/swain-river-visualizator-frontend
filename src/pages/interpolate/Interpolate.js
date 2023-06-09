import React from 'react';
import { useState, useEffect } from "react";
import MapComponents from './MapComponents'
import Navbar from '../../components/Navbar';
import SelectDate from './SelectDate';
import SelectType from './SelectType';
import LoadingMessage from '../../components/LoadingMessage';

function arrayRange(start, end, div = 5) {
    const arr = [];
    for (let i = 0; i <= div; i++) {
        arr.push(start + (end - start) / div * i);
    }
    console.log(start, end, arr);
    return arr;
} 

function Interpolate({setLoggedOut, onLogout}) {

    let [dates, setDates] = useState(null);
    let [selectedDate, setSelectedDate] = useState();
    let [types, setTypes] = useState(null);
    let [selectedType, setSelectedType] = useState();
    let [interpolatedRiver, setInterpolatedRiver] = useState(null);
    let [isLoading, setIsLoading] = useState(false);
    let [measurements, setMeasurements] = useState(null);
    let [measurementVisibility, setMeasurementVisibility] = useState(false);

    let [scaleList, setScaleList] = useState([0, 0, 0, 0, 0, 0]);

    const handleInputChange = (event, index) => {
        const newList = [...scaleList];
        if (event.target.value === '') {
            newList[index] = 0;
            setScaleList(newList);
            return;
        }
        newList[index] = parseFloat(event.target.value);
        setScaleList(newList);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setInterpolatedRiver(null);
        setTypes(null);
        setMeasurements(null);
        setScaleList([0, 0, 0, 0, 0, 0]);
        const controller = new AbortController()
        if (selectedDate) {
            fetch(process.env.REACT_APP_BACKEND_APP + '/measurement/' + selectedDate + '/type', {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        setLoggedOut();
                        localStorage.removeItem('token');
                    }
                    return res.json();
                })
                .then(json => {
                    setTypes(json)  
                })
                .catch(error => {
                    if (error.name === "SyntaxError") {
                        alert('There was an error fetching data from the server. Please try again later.');
                    }
                })
        }

        return () => controller.abort()
    }, [selectedDate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()

        if (!selectedDate || !selectedType) {
            return
        }

        setScaleList([0, 0, 0, 0, 0, 0]);

        fetch(process.env.REACT_APP_BACKEND_APP + '/measurement/catalog/' + selectedDate + '/' + selectedType, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }})
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
                return res.json();
            })
            .then(json => {
                let min = json["min-value"];
                let max = json["max-value"];
                let scaleList = arrayRange(min, max);
                setScaleList(scaleList);
            })
            .catch(error => {
                if (error.name === "SyntaxError") {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })
        
        return () => controller.abort()
    }, [selectedType])

    const retrieveMeasurements = async () => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
        setMeasurements(null);
        if (selectedDate && selectedType) {
            fetch(process.env.REACT_APP_BACKEND_APP + '/measurement/' + selectedDate + '/' + selectedType, {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        setLoggedOut();
                        localStorage.removeItem('token');
                    }
                    return res.json();
                })
                .then(json => {
                    setMeasurements(json)
                })
                .catch(error => {
                    if (error.name === 'SyntaxError') {
                        alert('There was an error fetching data from the server. Please try again later.');
                        setLoggedOut();
                        localStorage.removeItem('token');
                    }
                })
        }
        return () => controller.abort()
    }

    const retrieveInterpolation = async () => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
        setInterpolatedRiver(null);
        if (selectedDate && selectedType) {
            setIsLoading(true);
            fetch(process.env.REACT_APP_BACKEND_APP + `/interpolate/${selectedDate}/${selectedType}?${scaleList.map(scale => `scaleArray=${scale}`).join('&')}`, {
                signal: controller.signal,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        setLoggedOut();
                        localStorage.removeItem('token');
                    }
                    return res.json();
                })
                .then(json => {
                    setInterpolatedRiver(json)
                    setIsLoading(false);
                })
                .catch(error => {
                    if (error.name === 'SyntaxError') {
                        alert('There was an error fetching data from the server. Please try again later.');
                        setLoggedOut();
                        localStorage.removeItem('token');
                    }
                    setIsLoading(false);
                })
        }

        return () => controller.abort()
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()

        fetch(process.env.REACT_APP_BACKEND_APP + '/measurement/date', {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
                return res.json();
            })
            .then(json => {
                setDates(json)
            })
            .catch(error => {
                if (error.name === 'SyntaxError') {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })

        return () => controller.abort()
    }, []);

    useEffect(() => {
        // Do something with the "types" state here, if needed.
    }, [types]);

    const handleInterpolation = async () => {
        retrieveInterpolation();
        retrieveMeasurements();
    }

    return (
        <div>
            <h1>Interpolate</h1>
            <Navbar logOut={onLogout}/>
            {dates && (
                <div className='interpolation-form'>
                    <div className='selected-date-type'>
                        <div>
                            <SelectDate dates={dates} 
                                setSelectedDate={setSelectedDate} />
                        </div>
                        <br />
                        <div>
                            {types && <SelectType types={types}
                                setSelectedType={setSelectedType} />}
                        </div>
                    </div>
                    <div className='select-ranges margin-horizontal-20'>
                    {selectedDate && selectedType && (
                        <div className='range-form' style={{flexDirection:'row'}}>
                            <div style={{flexDirection:'column'}}>
                            {scaleList && scaleList.map((scale, index) => {
                                if (index !== scaleList.length - 1) {
                                    return (
                                    <div key={index} className='margin-top-20'>
                                        <label>{index+1}. Scale</label>
                                    </div>
                                    );
                                } else {
                                    return <div key={index}></div>;
                                }
                            })}
                            </div>
                            <div style={{flexDirection: 'column'}}>
                                {scaleList &&
                                    scaleList.map((scale, index) => (
                                    index !== scaleList.length - 1 && (
                                        <div key={index}>
                                        <input
                                            type='number'
                                            value={scale}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                        </div>
                                    )
                                    ))}
                            </div>
                            <div style={{flexDirection: 'column'}}>
                                {scaleList &&
                                    scaleList.map((scale, index) => (
                                    index !== 0 && (
                                        <div key={index}>
                                        <input
                                            type='number'
                                            value={scale}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                        </div>
                                    )
                                    ))}
                                <button className='general-button margin-top-20' 
                                    onClick={handleInterpolation}>Interpolate</button>
                            </div>
                        </div>
                    )}
                    </div>

                    <div>
                    {interpolatedRiver && <button 
                        className='general-button margin-top-20'
                        onClick={()=>{setMeasurementVisibility(!measurementVisibility)}}>
                            Show/Hide Measurement Values
                    </button>}
                    
                    {isLoading !== false && (<LoadingMessage />)}
                    
                    {interpolatedRiver && (<MapComponents 
                        interpolatedRiver={interpolatedRiver}
                        measurements={measurements}
                        measurementVisibility={measurementVisibility}
                        />)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Interpolate;