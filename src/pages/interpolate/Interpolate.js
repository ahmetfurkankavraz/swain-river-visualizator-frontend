import React from 'react';
import { GoogleMap } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import MapComponents from './MapComponents'
import Navbar from '../../components/Navbar';
import SelectDate from './SelectDate';
import SelectType from './SelectType';
import LoadingMessage from '../../components/LoadingMessage';
import MeasurementMarker from './MeasurementMarker';

const mapContainerStyle = {
    height: "500px",
    width: "800px"
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
    }, [selectedType])

    useEffect(() => {
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
    }, [selectedType]);

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

    return (
        <div>
            <h1>Interpolate</h1>
            <Navbar logOut={onLogout}/>
            {dates && (
                <div className='interpolation-form'>
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
            )}
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
    )
}

export default Interpolate;