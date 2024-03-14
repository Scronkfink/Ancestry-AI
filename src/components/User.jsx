import React, { useState } from "react";
import "../styles/user.css";
import { useNavigate } from 'react-router-dom';


const User = ({userInfo, setUserInfo}) => {
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
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json()
      console.log("login result:", result)
      if (result.login !== "failure") {
        setUserInfo([result.username, result.password])
        navigate('/home')
      }
    }
    
    catch (error) {
      console.error("Error:", error);
    }
  };

  const userSignup = async (e) => {
    e.preventDefault();

    let username = document.getElementById("signupUsername").value;
    let password = document.getElementById("signupPassword").value;


    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json()
      console.log("signup result:", result)
      if (result.signup !== "failure") {
        setUserInfo([result.username, result.password])
        navigate('/home')
      }
    }
    
    catch (error) {
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
