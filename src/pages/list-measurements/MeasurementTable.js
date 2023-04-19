import React from 'react';
import { useEffect, useState } from "react";
import LoadingMessage from '../../components/LoadingMessage';

function MeasurementTable(props){

    let {setLoggedAuth} = props;
    let {clickedDevice} = props.device;
    let [measurementList, setMeasurementList] = useState(null);
    let [isListChanged, setIsListChanged] = useState(false);
    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
        if (clickedDevice){
            setIsLoading(true);
            fetch('/measurement/' + clickedDevice, {
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
                    setMeasurementList(json);
                    setIsLoading(false);
                })
                .catch(error => {
                    if (error.name !== 'AbortError') {
                        alert('There was an error fetching data from the server. Please try again later.');
                        setLoggedAuth();
                        localStorage.removeItem('token');
                    }
                    setIsLoading(false);
                })
        }
        return () => controller.abort()
    }, [clickedDevice, isListChanged])

    const deleteRecord = async (measurementId) => {
        await fetch("/measurement/" + measurementId, {
            method: "DELETE"
        })
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                setLoggedAuth();
                localStorage.removeItem('token');
            }
            return res.json();
        })
        .then(() => {
            setIsListChanged(!isListChanged);
        })
        .catch(error => {
            alert('There was an error fetching data from the server. Please try again later.');
            setLoggedAuth();
            localStorage.removeItem('token');
        });
    }

    return (
        <>
            {isLoading && <LoadingMessage />}
            {!isLoading && <div className='margin-top-20'>
                <table className='measurement-table'>
                    <thead>
                        <tr>
                            <th>Measurement Id</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {measurementList && measurementList.map(measurement => (
                            <tr key={measurement._id} >
                                <th>{measurement._id}</th>
                                <th>{measurement.date}</th>
                                <th>{measurement.type}</th>
                                <th>{measurement.value}</th>
                                <th><button 
                                    className='general-button button-red'
                                    onClick={() => deleteRecord(measurement._id)}>Click</button></th>
                            </tr>
                        ))}
                    </tbody>    
                </table>
            </div>}
        </>
    )
}

export default MeasurementTable;