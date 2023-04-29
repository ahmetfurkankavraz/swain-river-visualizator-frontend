import React from 'react';
import { GoogleMap, PolylineF } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import DeviceMarker from "./DeviceMarker";
import Navbar from '../../components/Navbar';

const mapContainerStyle = {
    height: "600px",
    width: "1000px"
}
  
const options = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2.5,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 30000,
      zIndex: 1
};

function SaveMeasurements({setLoggedOut, onLogout}){

    let [river, setRiver] = useState(null);
    let [devices, setDevices] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
    
        fetch('/river', {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    setLoggedOut();
                }
                return res.json();
            })
            .then(json => {
                setRiver(json)
            })
            .catch(error => {
                if (error.name === 'SyntaxError') {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })
    
        return () => controller.abort()
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token');
        const controller = new AbortController()
    
        fetch('/device', {
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
                setDevices(json)
            })
            .catch(error => {
                if (error.name === 'SyntaxError') {
                    alert('There was an error fetching data from the server. Please try again later.');
                    setLoggedOut();
                    localStorage.removeItem('token');
                }
            })
    
        return () => controller.abort()
    }, [])


    return (
        <div>
            <h1>Save Measurements</h1>
            <Navbar logOut={onLogout}/>
            <div className='margin-top-20'>
                <GoogleMap
                    id="google-map"
                    mapContainerStyle={mapContainerStyle}
                    zoom={9}
                    center={{
                        "lng": 27.03827264000007,
                        "lat": 41.35322476700003
                    }}
                    onClick={(e) => {console.log(e.latLng.lat(), e.latLng.lng());}}>
                    
                    {river && river.map(riverBranch => (
                    <PolylineF
                        key={"id" + riverBranch.branchId}
                        path={riverBranch.riverPoints}
                        options={options}/>
                    ))}

                    {/* { river && river.map(riverBranch => (
                        <MarkerF key={riverBranch.branchId}
                            position={{
                                lat: riverBranch.riverPoints[0].lat,
                                lng: riverBranch.riverPoints[0].lng
                            }} />
                    ))} */}

                    {devices && devices.map(device => (
                        <DeviceMarker key={device._id} device={device} setLoggedOut={setLoggedOut} />
                    ))}

                </GoogleMap>
            </div>
        </div>
    )
}

export default SaveMeasurements;