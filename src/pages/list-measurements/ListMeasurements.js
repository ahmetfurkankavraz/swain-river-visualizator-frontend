import React from 'react';
import { useState } from "react";
import Maps from './Maps';
import MeasurementTable from './MeasurementTable';
import Navbar from '../../components/Navbar';
import LoadingMessage from '../../components/LoadingMessage';

  
function ListMeasurements({setLoggedOut, onLogout}){

    let [clickedDevice, setClickedDevice] = useState(null);

    let [river, setRiver] = useState(null);
    let [devices, setDevices] = useState(null);

    return (
        <div>
            <h1>List Measurements</h1>
            <Navbar logOut={onLogout}/>
            {(!river || !devices) && <LoadingMessage />}
            <Maps
                setClickedDevice={setClickedDevice}
                setLoggedOut={setLoggedOut}
                river={river}
                setRiver={setRiver}
                devices={devices}
                setDevices={setDevices} />
            <MeasurementTable device={{
                clickedDevice,
                setClickedDevice
            }}
            setLoggedOut={setLoggedOut} />
        </div>
    )
}

export default ListMeasurements;