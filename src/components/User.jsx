import React, { useState } from "react";
import "../styles/user.css";
import { useNavigate } from 'react-router-dom';

const baseUrl = process.env.REACT_APP_API_URL

const User = ({setUserInfo}) => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const loginClickHandler = () => {
    setLogin(true);
    setSignup(false);
  };

  const signupClickHandler = () => {
    setSignup(true);
    setLogin(false);
  };

  const cancelLogin = () => {
    setLogin(false);
    setSignup(false);
  };

  const userLogin = async (e) => {
    e.preventDefault();
  
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;
  
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json();
      console.log("login result:", result);
      if (result.token) { // Assuming the server responds with a token upon successful authentication
        // Storing token in localStorage (or sessionStorage as per your security consideration)
        localStorage.setItem("token", result.token);
        // Adjust setUserInfo to include username and possibly the token for subsequent authenticated requests
        setUserInfo([ result.username, result.token ]);
        navigate('/home');
      } else {
        console.error("Login failed: ", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const userSignup = async (e) => {
    e.preventDefault();
  
    let username = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;
  
    try {
      const response = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json();
      console.log("signup result:", result);
      if (result.token) { // Similar assumption as login
        // Storing token in localStorage (or sessionStorage)
        localStorage.setItem("token", result.token);
        // Adjust setUserInfo similarly to login
        setUserInfo({ username: result.username, token: result.token });
        navigate('/home');
      } else {
        console.error("Signup failed: ", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="user">
      <h1>Welcome to the Riva LLM</h1>
      <div className="buttons">
        <button className="login" onClick={loginClickHandler}>
          Login
        </button>
        <button className="signup" onClick={signupClickHandler}>
          Signup
        </button>
      </div>
      {login && (
        <div className="login-form">
          <input placeholder="Username" className="username" id="loginUsername" />
          <input placeholder="Password" type="password" className="password" id="loginPassword" />
          <button className="cancel" onClick={cancelLogin}>
            Cancel
          </button>
          <button className="signup-confirm" onClick={userLogin}>
            Sign-in
          </button>
        </div>
      )}
      {signup && (
        <div className="signup-form">
          <input placeholder="Username" className="username" id="signupUsername" />
          <input placeholder="Password" type="password" className="password" id="signupPassword" />
          <button className="cancel" onClick={cancelLogin}>
            Cancel
          </button>
          <button className="signup-confirm" onClick={userSignup}>
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
