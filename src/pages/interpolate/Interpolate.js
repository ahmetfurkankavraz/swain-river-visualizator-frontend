import React from 'react';
import { GoogleMap } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import MapComponents from './MapComponents'
import Navbar from '../../components/Navbar';
import SelectDate from './SelectDate';
import SelectType from './SelectType';
import LoadingMessage from '../../components/LoadingMessage';

const mapContainerStyle = {
    height: "600px",
    width: "1000px"
}

function Interpolate({setLoggedAuth}) {

    let [dates, setDates] = useState(null);
    let [selectedDate, setSelectedDate] = useState();
    let [types, setTypes] = useState(null);
    let [selectedType, setSelectedType] = useState();
    let [interpolatedRiver, setInterpolatedRiver] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

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
                        setLoggedAuth();
                        localStorage.removeItem('token');
                    }
                    return res.json();
                })
                .then(json => {
                    setTypes(json)  
                })
                .catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error(error.message)
                    }
                })
        }

        return () => controller.abort()
    }, [selectedDate]);

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
                        setLoggedAuth();
                        localStorage.removeItem('token');
                    }
                    return res.json();
                })
                .then(json => {
                    setInterpolatedRiver(json)
                    setIsLoading(false);
                })
                .catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error(error.message)
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
                    setLoggedAuth();
                    localStorage.removeItem('token');
                }
                return res.json();
            })
            .then(json => {
                setDates(json)
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error(error.message)
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
            <Navbar />
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
            <br />
            {isLoading !== false && (<LoadingMessage />)}
            {interpolatedRiver && (<GoogleMap
                id="google-map"
                mapContainerStyle={mapContainerStyle}
                zoom={9}
                center={{
                    "lng": 27.03827264000007,
                    "lat": 41.35322476700003
                }}>
                <MapComponents interpolatedRiver={interpolatedRiver} />
            </GoogleMap>)}
        </div>
    )
}

export default Interpolate;