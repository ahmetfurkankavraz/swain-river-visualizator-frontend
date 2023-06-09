import React from 'react';
import { MarkerF } from "@react-google-maps/api";

function MeasurementMarker(props){

    const {measurement} = props;

    return (
        <MarkerF
            title={`Measurement Value is ${measurement.value} in the location\nLongitude: ${measurement.lng}\nLatitude${measurement.lat}`}
            position={{
                lat: measurement.lat,
                lng: measurement.lng
            }}
        >
            
        </MarkerF>
    )
}

export default MeasurementMarker;