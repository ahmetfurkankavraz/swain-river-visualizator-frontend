import React, { useState } from "react";
import crypto from "crypto";

function sha256(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password: sha256(password) }),
            })
            .then((res) => {
                if (res.status === 400) {
                    setErrorMessage("Invalid username or password");
                } 
                return res.json(); 
            })
            .then((json) => {
                const { accessToken } = json;
                localStorage.setItem('token', accessToken);
                onLogin();
            })
            .catch(error => {
                if (error.name === "SyntaxError") {
                    alert('There was an error fetching data from the server. Please try again later.');
                }
            });
            
        } catch (error) {
            
        }
    };

    return (
        <div className="login-container">
            <h2 className="margin-top-20 ">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button className="login-button" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Login;
