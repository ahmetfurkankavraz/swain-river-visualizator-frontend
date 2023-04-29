import React from 'react';
import { PolylineF } from "@react-google-maps/api";

const options = [{
    strokeColor: '#FFBBBB',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FFBBBB',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#FF9999',
    strokeOpacity: 0.8,
    strokeWeight: 2.25,
    fillColor: '#FF9999',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#FF6666',
    strokeOpacity: 0.8,
    strokeWeight: 2.5,
    fillColor: '#FF6666',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#FF3333',
    strokeOpacity: 0.8,
    strokeWeight: 2.75,
    fillColor: '#FF3333',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
}
];

function MapComponents(props){

    let {interpolatedRiver} = props;

    return (
        <>
            {interpolatedRiver && Array.isArray(interpolatedRiver) && 
                interpolatedRiver.map(riverBranch => (
                <PolylineF
                    key={"id" + riverBranch.branchId + "-" + riverBranch.segmentInd}
                    path={riverBranch.riverPoints}
                    options={options[riverBranch.scale]}/>
                ))}
        </>
    )
}

export default MapComponents;