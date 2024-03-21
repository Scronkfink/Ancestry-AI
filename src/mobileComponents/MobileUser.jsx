import React, { useState } from "react";
import "../mobileStyles/mobileUser.css"
import { useNavigate } from 'react-router-dom';

const MobileUser = ({ setUserInfo }) => {

  const baseUrl = process.env.REACT_APP_API_URL || ""
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
      const response = await fetch(`${baseUrl}/api/login`, {
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
      // console.log("login result: ", result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        setUserInfo([ result.username, result.token ]);
        navigate('/home');
      } 
      else {
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
      const response = await fetch(`${baseUrl}/api/signup`, {
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
      // console.log("signup result: ", result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        setUserInfo([result.username, result.token]);
        navigate('/home');
      } else {
        console.error("Signup failed: ", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mobileUser">
      <div className="mobileLogo">
        <h1>Ancestry AI</h1>
      </div>
      <h1>Preserve their legacy.</h1>
      <div className="mobileButtons">
        <button className="mobileLogin" onClick={loginClickHandler}>
          Login
        </button>
        <button className="mobileSignup" onClick={signupClickHandler}>
          Signup
        </button>
      </div>
      <div className="mobileFooter">Echoes of their wisdom, forever.</div>
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
  )
}

export default MobileUser