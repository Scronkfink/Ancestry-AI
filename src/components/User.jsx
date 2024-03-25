import React, { useState, useEffect } from "react";
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import "../styles/user.css";
const baseUrl = process.env.REACT_APP_API_URL || ""

//This page handles the users signing in and singing up.
//The states here trigger the display of login and signup portals.
//We are using local storage to persist non-confidential userInfo.

const User = ({setUserInfo}) => {

  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

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
      // console.log("login result: ", result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        setUserInfo([ result.username, result.token ]);
        navigate('/home');
      } 
      else {
        console.error("Login failed: ", result.message);
        alert("You either don't have an account or have input a wrong username/password")
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const userSignup = async (e) => {
    e.preventDefault();
  
    setIsDisabled(true);
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
      // console.log("signup result: ", result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        setUserInfo([result.username, result.token]);
        navigate('/home');
      } else {
        console.error("Signup failed: ", result.message);
        alert("This username might be taken already")
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const prompts = [
    {
      prompt: "Hey nana, give me your favorite recipe for",
      continuations: ["making a lobster ceviche.", "baking a chocolate cake.", "cooking a vegan lasagna."]
    },
    {
      prompt: "Aye pops, what's your best tip for",
      continuations: ["organizing a small kitchen?", "meal prepping for the week?", "selecting the freshest seafood?"]
    },
    {
      prompt: "Hey ma, how would you prepare",
      continuations: ["your morning coffee?", "a quick and healthy breakfast?", "a romantic dinner for two?"]
    }
  ];

  let promptCount = 0
  let continuationCount = 0
  const [currentPrompt, setCurrentPrompt] = useState(prompts[promptCount].prompt);
  const [currentContinuation, setCurrentContinuation] = useState(prompts[promptCount].continuations
    [continuationCount]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showContinuation, setShowContinuation] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setShowPrompt(false);
      setTimeout(() => {
        promptCount++;
        if (promptCount === prompts.length) {
          promptCount = 0;
        }
        setCurrentPrompt(prompts[promptCount].prompt);
        setShowPrompt(true);
      }, 500);
    }, 9000);
  }, []);

  useEffect(() => {
    setInterval(() => {
      setShowContinuation(false);
      setTimeout(() => {
        continuationCount++;
        if (continuationCount === prompts.length) {
          continuationCount = 0;
        }
        setCurrentContinuation(prompts[promptCount].continuations
          [continuationCount]);
          setShowContinuation(true);
      }, 500);
    }, 3000);
  }, []);



  return (
    <div className="user">
      <h1>Ancestry AI</h1>
    <div className="demo">
    <CSSTransition in={showPrompt} timeout={500} classNames="fade" unmountOnExit>
          <h1>{currentPrompt}</h1>
      </CSSTransition>
      <CSSTransition in={showContinuation} timeout={500} classNames="fade" unmountOnExit>
          <p>{currentContinuation}</p>
      </CSSTransition>
    </div>
    <div className="buttons-container">
      <h1>Preserve their legacy.</h1>
      <div className="buttons">
        <button className="login" onClick={loginClickHandler}>
          Login
        </button>
        <button className="signup" onClick={signupClickHandler}>
          Signup
        </button>
      </div>
      <div className="userFooter">Echoes of their wisdom, forever.</div>
      </div>
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
  );
};

export default User;
