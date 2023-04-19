import React from 'react';
import { useState } from "react";
import Maps from './Maps';
import MeasurementTable from './MeasurementTable';
import Navbar from '../../components/Navbar';

  
function ListMeasurements({setLoggedOut}){

    let [clickedDevice, setClickedDevice] = useState(null);

    return (
        <div>
            <h1>List Measurements</h1>
            <Navbar/>
            <Maps
                setClickedDevice={setClickedDevice}
                setLoggedOut={setLoggedOut} />
            <MeasurementTable device={{
                clickedDevice,
                setClickedDevice
            }}
            setLoggedOut={setLoggedOut} />
        </div>
    )
}

export default ListMeasurements;