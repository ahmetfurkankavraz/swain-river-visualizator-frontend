import React from 'react';
import { GoogleMap } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import MapComponents from './MapComponents'
import Navbar from '../../components/Navbar';
import SelectDate from './SelectDate';
import SelectType from './SelectType';
import LoadingMessage from '../../components/LoadingMessage';
import MeasurementMarker from './MeasurementMarker';

function arrayRange(start, end, step = 1) {
    const arr = [];
    for (let i = start; i <= end; i += step) {
      arr.push(i);
    }
    return arr;
}
  

const mapContainerStyle = {
    height: "500px",
    width: "600px"
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
    let [buttonClicked, setButtonClicked] = useState(false);

    const handleInputChange = (event, index) => {
        const newList = [...scaleList];
        if (event.target.value === '') {
            newList[index] = 0;
            setScaleList(newList);
            return;
        }
        newList[index] = parseFloat(event.target.value);
        setScaleList(newList);
        console.log(newList);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setInterpolatedRiver(null);
        setTypes(null);
        const controller = new AbortController()
        if (selectedDate) {
            fetch('/measurement/' + selectedDate + '/type', {
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

        if (!selectedDate && !selectedType) {
            return
        }

        setScaleList([0, 0, 0, 0, 0, 0]);

        fetch('/measurement/catalog/' + selectedDate + '/' + selectedType, {
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
                let scaleList = arrayRange(min, max, (max-min)/5);
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

    const retrieveInterpolation = async () => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
        setInterpolatedRiver(null);
        if (selectedDate && selectedType) {
            setIsLoading(true);
            fetch('/interpolate/' + selectedDate + '/' + selectedType, {
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

        fetch('/measurement/date', {
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
                            <div>
                                <label>Ranges</label>
                            </div>
                            <div style={{flexDirection:'column'}}>
                            {scaleList && scaleList.map((scale, index) => {
                                if (index !== scaleList.length - 1) {
                                    return (
                                    <div className='margin-top-20'>
                                        <label>{index+1}th Group</label>
                                    </div>
                                    );
                                } else {
                                    return <></>; // render nothing
                                }
                            })}
                            </div>
                            <div style={{flexDirection:'column'}}>
                                {scaleList && scaleList.map((scale, index) => (
                                    <div>
                                    <input 
                                        type='number'
                                        key={index}
                                        value={scaleList[index]}
                                        onChange={(e) => {handleInputChange(e, index)}}/>
                                    </div>
                                ))}
                                <button className='general-button margin-top-20'
                                    onClick={handleInterpolation} >Interpolate</button>
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
                    
                    {interpolatedRiver && (<GoogleMap
                        id="google-map"
                        mapContainerStyle={mapContainerStyle}
                        zoom={9}
                        center={{
                            "lng": 27.16827264000007,
                            "lat": 41.35322476700003
                        }}>

                        {measurementVisibility && measurements && measurements.map(measurement => (
                            <MeasurementMarker key={measurement._id} measurement={measurement} />
                        ))}
                        <MapComponents interpolatedRiver={interpolatedRiver} />
                    </GoogleMap>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Interpolate;