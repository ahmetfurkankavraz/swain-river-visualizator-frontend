import React, { useState } from "react";

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
                body: JSON.stringify({ username, password }),
            })
            .then((res) => {
                if (!res.ok) {
                    setErrorMessage("Invalid username or password");
                } else {
                    const data = res.json();
                    const { accessToken } = data;
                    localStorage.setItem('token', accessToken);
                    onLogin();
                }
                return res.json(); 
            })
            .catch(error => {
                alert('There was an error fetching data from the server. Please try again later.');
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
