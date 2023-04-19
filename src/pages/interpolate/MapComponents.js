import React from 'react';
import { PolylineF } from "@react-google-maps/api";

const options = [{
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
},
{
    strokeColor: '#AA0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#AA0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#AA00AA',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#AA00AA',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#0000AA',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#0000AA',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
},
{
    strokeColor: '#0000FF',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#0000FF',
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