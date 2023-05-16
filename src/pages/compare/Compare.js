import React from 'react';
import { useState, useEffect } from "react";
import MapComponents from './MapComponents'
import Navbar from '../../components/Navbar';
import SelectDate from './SelectDate';
import SelectType from './SelectType';
import LoadingMessage from '../../components/LoadingMessage';

function arrayRange(start, end, step = 1) {
    const arr = [];
    for (let i = start; i <= end; i += step) {
      arr.push(i);
    }
    return arr;
} 

function Interpolate({setLoggedOut, onLogout}) {

    let [dates, setDates] = useState(null);
    let [selectedDate1, setSelectedDate1] = useState();
    let [selectedDate2, setSelectedDate2] = useState();
    let [types, setTypes] = useState(null);
    let [selectedType, setSelectedType] = useState();
    let [interpolatedRiver1, setInterpolatedRiver1] = useState(null);
    let [interpolatedRiver2, setInterpolatedRiver2] = useState(null);
    let [isLoading, setIsLoading] = useState(false);
    let [measurements1, setMeasurements1] = useState(null);
    let [measurements2, setMeasurements2] = useState(null);

    let [measurementVisibility1, setMeasurementVisibility1] = useState(false);
    let [measurementVisibility2, setMeasurementVisibility2] = useState(false);

    let [scaleList, setScaleList] = useState([0, 0, 0, 0, 0, 0]);
    let [minDate1, setMinDate1] = useState(null);
    let [minDate2, setMinDate2] = useState(null);
    let [maxDate1, setMaxDate1] = useState(null);
    let [maxDate2, setMaxDate2] = useState(null);

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

    // select the type that will be used for interpolation
    useEffect(() => {
        const token = localStorage.getItem('token');
        setInterpolatedRiver1(null);
        setInterpolatedRiver2(null);
        setDates(null);
        setMeasurements1(null);
        setMeasurements2(null);
        setScaleList([0, 0, 0, 0, 0, 0]);
        const controller = new AbortController()
        if (selectedType) {
            fetch('/measurement/' + selectedType + '/date', {
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
                    if (error.name === "SyntaxError") {
                        alert('There was an error fetching data from the server. Please try again later.');
                    }
                })
        }

        return () => controller.abort()
    }, [selectedType]);

    const updateScaleList = () => {
        if (minDate1 === null || minDate2 === null || maxDate1 === null || maxDate2 === null || 
            minDate1 === undefined || minDate2 === undefined || maxDate1 === undefined || maxDate2 === undefined) {
            return
        }
        let minOfMin = Math.min(minDate1, minDate2);
        let maxOfMax = Math.max(maxDate1, maxDate2);
        let scaleList = arrayRange(minOfMin, maxOfMax, (maxOfMax-minOfMin) / 5);
        setScaleList(scaleList);
    }

    // select the first date for interpolation
    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()

        setMinDate1(null);
        setMaxDate1(null);

        if (!selectedDate1 || !selectedType) {
            return
        }

        setScaleList([0, 0, 0, 0, 0, 0]);

        fetch('/measurement/catalog/' + selectedDate1 + '/' + selectedType, {
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
                setMinDate1(min);
                setMaxDate1(max);
                updateScaleList();
            })
            .catch(error => {
                if (error.name === "SyntaxError") {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })
        
        return () => controller.abort()
    }, [selectedDate1])

    // select the second date for interpolation
    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()

        setMinDate2(null);
        setMaxDate2(null);

        if (!selectedDate2 || !selectedType) {
            return
        }

        setScaleList([0, 0, 0, 0, 0, 0]);

        fetch('/measurement/catalog/' + selectedDate2 + '/' + selectedType, {
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
                setMinDate2(min);
                setMaxDate2(max);
                updateScaleList();
            })
            .catch(error => {
                if (error.name === "SyntaxError") {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })
        
        return () => controller.abort()
    }, [selectedDate2])

    const retrieveMeasurements = async (selectedDate, setMeasurements) => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
        setMeasurements(null);
        if (selectedDate && selectedType) {
            fetch('/measurement/' + selectedDate + '/' + selectedType, {
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

    const retrieveInterpolation = async (selectedDate, setInterpolatedRiver) => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
        setInterpolatedRiver(null);
        if (selectedDate && selectedType) {
            setIsLoading(true);
            fetch(`/interpolate/${selectedDate}/${selectedType}?${scaleList.map(scale => `scaleArray=${scale}`).join('&')}`, {
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

        fetch('/measurement/type', {
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
                if (error.name === 'SyntaxError') {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })

        return () => controller.abort()
    }, []);

    const handleInterpolation = async () => {
        retrieveInterpolation(selectedDate1, setInterpolatedRiver1);
        retrieveInterpolation(selectedDate2, setInterpolatedRiver2);
        retrieveMeasurements(selectedDate1, setMeasurements1);
        retrieveMeasurements(selectedDate2, setMeasurements2);
    }

    return (
        <div>
            <h1>Compare</h1>
            <Navbar logOut={onLogout}/>
            {types && (
                <>
                <div className='interpolation-form'>
                    <div className='selected-date-type'>
                        <div>
                            <SelectType types={types}
                                setSelectedType={setSelectedType} />
                            
                        </div>
                        <br />
                        <div style={{flexDirection: 'column'}}>
                            {dates && <SelectDate dates={dates} 
                                setSelectedDate={setSelectedDate1} />}
                            {dates && <SelectDate dates={dates} 
                                setSelectedDate={setSelectedDate2} />}
                        </div>
                    </div>
                    <div className='select-ranges margin-horizontal-20'>
                    {selectedDate1 && selectedDate2 && selectedType && (
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
                                    onClick={handleInterpolation}>Compare</button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        {isLoading !== false && (<LoadingMessage />)}
                    </div>                    
                    {interpolatedRiver1 && <div style={{margin: '0px 20px'}}>
                        <button 
                            className='general-button margin-top-20'
                            onClick={()=>{setMeasurementVisibility1(!measurementVisibility1)}}>
                                Show/Hide Measurement Values of the first
                        </button>
                        <MapComponents 
                            id={1}
                            interpolatedRiver={interpolatedRiver1}
                            measurements={measurements1}
                            measurementVisibility={measurementVisibility1}
                            />
                    </div>}
                    { interpolatedRiver2 && <div style={{margin: '0px 20px'}}>
                        <button 
                            className='general-button margin-top-20'
                            onClick={()=>{setMeasurementVisibility2(!measurementVisibility2)}}>
                                Show/Hide Measurement Values of the second
                        </button>
                        <MapComponents 
                            id={2}
                            interpolatedRiver={interpolatedRiver2}
                            measurements={measurements2}
                            measurementVisibility={measurementVisibility2}
                            />
                    </div>}
                </div>
                </>
            )}
        </div>
    )
}

export default Interpolate;