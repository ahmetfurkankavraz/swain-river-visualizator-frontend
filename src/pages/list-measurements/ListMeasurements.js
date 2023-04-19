import React from 'react';
import { useState } from "react";
import Maps from './Maps';
import MeasurementTable from './MeasurementTable';
import Navbar from '../../components/Navbar';

  
function ListMeasurements({setLoggedAuth}){

    let [clickedDevice, setClickedDevice] = useState(null);

    return (
        <div>
            <h1>List Measurements</h1>
            <Navbar/>
            <Maps
                setClickedDevice={setClickedDevice}
                setLoggedAuth={setLoggedAuth} />
            <MeasurementTable device={{
                clickedDevice,
                setClickedDevice
            }}
            setLoggedAuth={setLoggedAuth} />
        </div>
    )
}

export default ListMeasurements;