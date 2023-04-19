import React from "react";
import { useState, useEffect } from "react";

function SelectDate(props){

    const {dates, setSelectedDate} = props;
    const [date, setDate] = useState();

    useEffect(() => {
        setSelectedDate(date);
    }, [date])

    return (
        <>
            <label htmlFor="date">Select a date: </label>
            <select value={date} name="date" onChange={(e) => { setDate(e.target.value) }}>
                <option value={null}>Select a date</option>
                {dates.map(date => (<option value={date} key={date}>{date}</option>))}
            </select>
        </>
    )
}

export default SelectDate;