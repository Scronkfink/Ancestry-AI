import React, { useState, useEffect } from "react";
import "../mobileStyles/mobileUser.css"
import { useNavigate } from 'react-router-dom';

const MobileUser = ({ setUserInfo }) => {

  const baseUrl = process.env.REACT_APP_API_URL || ""
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let viewportmeta = document.querySelector('meta[name="viewport"]');
    if(viewportmeta===null){
    viewportmeta = document.createElement("meta");
    viewportmeta.setAttribute("name","viewport");
    document.head.appendChild(viewportmeta);
  
    viewportmeta = document.querySelector('meta[name="viewport"]');
  }
  viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
  }, []);
  //play with this dependecy array to allow zoom in for inputs.

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
  
    setIsDisabled(true);

    function resetZoom() {
      document.activeElement.blur();
      window.scrollTo(0,0);
    }

    resetZoom()
    setTimeout(() => setIsDisabled(false), 3000);
    
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
      console.log("mobileLogin result: ", result);
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
  
    setIsDisabled(true);

    function resetZoom() {
      document.activeElement.blur();
      window.scrollTo(0,0);
    }
    resetZoom();

    setTimeout(() => setIsDisabled(false), 3000);

    let username = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;
    let email = document.getElementById("signupEmail").value;

    try {
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        }),
      });
      const result = await response.json();
      console.log("mobileSignup result: ", result);
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
      <div className="userMobileFooter">Echoes of their wisdom, forever.</div>
      {login && (
        <div className="login-form">
          <input placeholder="Username" className="username" id="loginUsername" />
          <input placeholder="Password" type="password" className="password" id="loginPassword" />
          <button className="cancel" onClick={cancelLogin}>
            Cancel
          </button>
          <button className="signup-confirm" onClick={userLogin} disabled={isDisabled}>
            Sign-in
          </button>
        </div>
      )}
      {signup && (
        <div className="signup-form">
          <input placeholder="Username" className="username" id="signupUsername" />
          <input placeholder="Password" type="password" className="password" id="signupPassword" />
          <input placeholder="Email" className="email" id="signupEmail"/>
          <button className="cancel" onClick={cancelLogin}>
            Cancel
          </button>
          <button className="signup-confirm" onClick={userSignup} disabled={isDisabled}>
            Sign Up
          </button>
        </div>
      )}
    </div>
  )
}

export default MobileUser