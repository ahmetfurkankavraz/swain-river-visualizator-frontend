import React from 'react';
import { MarkerF } from "@react-google-maps/api";

function DeviceMarker(props){

    const {device, setClickedDevice} = props;

    return (
        <MarkerF
            title={`Longitude: ${device.lng}\nLatitude: ${device.lat}`}
            position={{
                lat: device.lat,
                lng: device.lng
            }}
            onClick={() => {setClickedDevice(device._id)}}
        >
            
        </MarkerF>
    )
}

export default DeviceMarker;