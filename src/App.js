import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Interpolate from "./pages/interpolate/Interpolate";
import ListMeasurements from "./pages/list-measurements/ListMeasurements";
import SaveMeasurements from "./pages/save-measurement/SaveMeasurements";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    const handleLogin = () => {
        setAuthenticated(true);
    }

    const setLoggedOut = () => {
        setAuthenticated(false);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthenticated(true);
        } else { 
            setAuthenticated(false);
        }
    });

    return (
        <BrowserRouter>
            <Routes>
                {!authenticated && <Route path="/login" element={<Login onLogin={handleLogin} />} />}
                {authenticated && <Route path="/" element={<Home setLoggedOut={setLoggedOut}/>} />}
                {authenticated && <Route path="list-measurements" element={<ListMeasurements setLoggedOut={setLoggedOut}/>} />}
                {authenticated && <Route path="save-measurement" element={<SaveMeasurements setLoggedOut={setLoggedOut}/>} />}
                {authenticated && <Route path="interpolate" element={<Interpolate setLoggedOut={setLoggedOut}/>} />}
                {!authenticated && <Route path="*" element={<Navigate to="/login"/>} />}
                {authenticated && <Route path="*" element={<Navigate to="/"/>} />}
            </Routes>
        </BrowserRouter>
    )
}

export default App;
