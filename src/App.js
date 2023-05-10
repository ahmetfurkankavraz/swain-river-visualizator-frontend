import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Interpolate from "./pages/interpolate/Interpolate";
import ListMeasurements from "./pages/list-measurements/ListMeasurements";
import SaveMeasurements from "./pages/save-measurement/SaveMeasurements";
import Compare from "./pages/compare/Compare";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import CrossingPointsObserver from "./pages/crossing-points-observer/CatalogObserver";

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    const handleLogin = () => {
        setAuthenticated(true);
    }

    const setLoggedOut = () => {
        setAuthenticated(false);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
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
                {authenticated && <Route path="/" element={<Home setLoggedOut={setLoggedOut} onLogout={handleLogout}/>} />}
                {authenticated && <Route path="list-measurements" element={<ListMeasurements setLoggedOut={setLoggedOut} onLogout={handleLogout}/>} />}
                {authenticated && <Route path="save-measurement" element={<SaveMeasurements setLoggedOut={setLoggedOut} onLogout={handleLogout}/>} />}
                {authenticated && <Route path="interpolate" element={<Interpolate setLoggedOut={setLoggedOut} onLogout={handleLogout}/>} />}
                {authenticated && <Route path="compare" element={<Compare setLoggedOut={setLoggedOut} onLogout={handleLogout}/>} />}
                {authenticated && <Route path="crossing-points-observer" element={<CrossingPointsObserver setLoggedOut={setLoggedOut} onLogout={handleLogout}/>} />}
                {!authenticated && <Route path="*" element={<Navigate to="/login"/>} />}
                {authenticated && <Route path="*" element={<Navigate to="/" onLogout={handleLogout}/>} />}
            </Routes>
        </BrowserRouter>
    )
}

export default App;
