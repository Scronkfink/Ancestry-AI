import React from "react";
import "../mobileStyles/mobileSettings.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileSettings = ({setShowMobileSettings}) => {

  const navigate = useNavigate();

  useEffect(() => {
    let viewportmeta = document.querySelector('meta[name="viewport"]');
    if(viewportmeta===null){
    viewportmeta = document.createElement("meta");
    viewportmeta.setAttribute("name","viewport");
    document.head.appendChild(viewportmeta);
  
    viewportmeta = document.querySelector('meta[name="viewport"]');
  }
  viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
  // console.log("this is viewport: ", document.querySelector('meta[name="viewport"]'));
  }, []);

  const [showSpeechData, setShowSpeechData] = useState(false);
  const [showTextData, setShowTextData] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const speechDataClickHandler = () => {
    setShowModel(false)
    setShowPayments(false)
    setShowSpeechData(true)
    setShowTextData(false)
    console.log("speech clicked")
  }
  const textDataClickHandler = () => {
    console.log("text clicked")
    setShowModel(false)
    setShowPayments(false)
    setShowSpeechData(false)
    setShowTextData(true)
  }
  const paymentsClickHandler = () => {
    console.log("payments clicked")
    setShowModel(false)
    setShowPayments(true)
    setShowSpeechData(false)
    setShowTextData(false)
  }
  const modelClickHandler = () => {
    console.log("llm clicked")
    setShowModel(true)
    setShowPayments(false)
    setShowSpeechData(false)
    setShowTextData(false)
  }

  const closeSettings = () => {
    setShowMobileSettings(false)
    return
  }

  const logoutClickHandler = () => {
    localStorage.clear();
    navigate("/")
  };

  return(
    <div className="mobileSettingsDisplay">
      <div className="mobileSettingsNavbar">
        <p>Settings</p>
        <button onClick={closeSettings}>X</button>
      </div>
      <div className="mobileButtonsContainer">
        <button>Profile</button>
        <button onClick={speechDataClickHandler}>Speech data</button>
        <button onClick={textDataClickHandler}>Text Data</button>
        <button onClick={paymentsClickHandler}>Payments</button>
        <button onClick={modelClickHandler}>LLM Model</button>
      </div>
      <div className="mobileLogout">
        <button onClick={logoutClickHandler}>Logout</button>
      </div>
      {showSpeechData && (
        <div className="mobileSpeechData">
          speech div
        </div>
      )}
      {showTextData && (
        <div className="mobileTextData">
          text div
        </div>
      )}
      {showPayments && (
        <div className="mobilePayments">
          payments div
        </div>
      )}
      {showModel && (
        <div className="mobileModel">
          model div
        </div>
      )}
    </div>
  )
}

export default MobileSettings