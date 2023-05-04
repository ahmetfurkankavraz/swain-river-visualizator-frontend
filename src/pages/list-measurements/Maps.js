import React from 'react';
import { GoogleMap, PolylineF } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import DeviceMarker from './DeviceMarker';

const mapContainerStyle = {
    height: "500px",
    width: "750px"
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

function Maps(props){

    let {setClickedDevice, setLoggedOut} = props

    let [river, setRiver] = useState(null);
    let [devices, setDevices] = useState(null);

    useEffect(() => {
        const controller = new AbortController()
        const token = localStorage.getItem('token');
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
                    localStorage.removeItem('token');
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
        <div className='margin-top-20'>
            {river && <GoogleMap
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

                {devices && devices.map(device => (
                    <DeviceMarker key={device._id} device={device} setClickedDevice={setClickedDevice} />
                ))}

            </GoogleMap>}
        </div>
    )
}

export default Maps;