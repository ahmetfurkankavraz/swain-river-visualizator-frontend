import React from "react";
import { useState, useEffect } from "react";

function SelectType(props){

    const {types, setSelectedType} = props;
    const [type, setType] = useState();

    useEffect(() => {
        setSelectedType(type);
    }, [type])

    return (
        <div>
            <label htmlFor="type">Select a type: </label>
            <select value={type} name="type" onChange={(e) => { setType(e.target.value) }}>
                <option value={null}>Select a type</option>
                {types.map(type => (<option value={type} key={type}>{type}</option>))}
            </select>
        </div>
    )
}

export default SelectType;