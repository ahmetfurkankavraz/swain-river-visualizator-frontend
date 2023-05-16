import React from 'react';
import { MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useState } from "react";

function DeviceMarker(props){

    let [date, setDate] = useState("");
    let [type, setType] = useState("");
    let [value, setValue] = useState(0);
    let [message, setMessage] = useState("");

    const {setLoggedOut, device} = props;
    let [visible, setVisible] = useState(false);

    const handleSubmit = async (e) => {
        const controller = new AbortController()
        const token = localStorage.getItem('token');

        e.preventDefault();
        await fetch("/measurement", {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify({
                pointId: device._id,
                date: date,
                type: type,
                value: parseFloat(value)
            })
        }).then((res) => {
            console.log(res);
            setMessage("Status Code: " + res.status + " and  " + res.statusText);
        }).catch((error) => {
            if (error.name === 'SyntaxError') {
                alert('There was an error fetching data from the server. Please try again later.');
                setLoggedOut();
                localStorage.removeItem('token');
            }
        });
        return () => controller.abort()
    }

    return (
        <MarkerF
            title={`Longitude: ${device.lng}\nLatitude: ${device.lat}`}
            position={{
                lat: device.lat,
                lng: device.lng
            }}
            onClick={() => {setVisible(!visible);}}
        >

            {visible && <InfoWindowF
                position={{
                    lat: device.lat,
                    lng: device.lng
                }}
                visible={false}>
                    <div className='device-form'>
                        <h2>Save Device Measurement</h2>
                        <form
                            onSubmit={handleSubmit}>
                            <div className='form-row'>
                                <label is='form-input-date'>Date: </label>
                                <input 
                                    id='form-input-date'
                                    type="text" 
                                    value={date}
                                    onChange={val => setDate(val.target.value)} 
                                    required={true}
                                    pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                                    title='Date format must be YYYY-MM-DD'/>
                            </div>
                            <div className='form-row'>
                                <label is='form-input-type'>Type: </label>
                                <input 
                                    id='form-input-type'
                                    type="text" 
                                    value={type}
                                    onChange={val => setType(val.target.value)}
                                    required={true}
                                    pattern='[a-zA-Z0-9]+'
                                    title='Type must be non-empty alphanumeric'/>
                            </div>

                            <div className='form-row'>
                                <label is='form-input-value'>Value: </label>
                                <input 
                                    id='form-input-value'
                                    type="number" 
                                    value={value}
                                    step="any"
                                    onChange={val => setValue(val.target.value)}
                                    required={true}
                                    title='Value must be a number'
                                    pattern='\d' />
                            </div>
                            <div>
                                <input type="submit" value="Save" />
                            </div>
                            
                        </form>
                        <div>{message}</div>
                    </div>
            </InfoWindowF>}
        </MarkerF>
    )
}

export default DeviceMarker;