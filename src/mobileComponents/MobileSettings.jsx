import React from "react";
import "../mobileStyles/mobileSettings.css"
import { useState, useEffect } from "react";

const MobileSettings = ({setShowMobileSettings, showMobileSettings}) => {


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

  const [showProfile, setShowProfile] = useState(false);
  const [showSpeechData, setShowSpeechData] = useState(false);
  const [showTextData, setShowTextData] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const profileClickHandler = () => {
    setShowPayments(false)
    setShowSpeechData(false)
    setShowTextData(false)
    setShowProfile(true)
    setShowModel(false)
    console.log("profile clicked")
  }
  const speechDataClickHandler = () => {
    setShowModel(false)
    setShowPayments(false)
    setShowSpeechData(true)
    setShowTextData(false)
    setShowProfile(false)
    console.log("speech clicked")
  }
  const textDataClickHandler = () => {
    console.log("text clicked")
    setShowModel(false)
    setShowPayments(false)
    setShowSpeechData(false)
    setShowTextData(true)
    setShowProfile(false)
  }
  const paymentsClickHandler = () => {
    console.log("payments clicked")
    setShowModel(false)
    setShowPayments(true)
    setShowSpeechData(false)
    setShowTextData(false)
    setShowProfile(false)
  }
  const modelClickHandler = () => {
    console.log("llm clicked")
    setShowModel(true)
    setShowPayments(false)
    setShowSpeechData(false)
    setShowTextData(false)
    setShowProfile(false)
  }

  const closeSettings = () => {
    setShowMobileSettings(false)
    return
  }

  return(
    <div className="mobileSettingsDisplay">
      <div className="mobileSettingsNavbar">
        <p>Settings</p>
        <button onClick={closeSettings}>X</button>
      </div>
      <div className="mobileButtonsContainer">
        <button onClick={profileClickHandler}>Profile</button>
        <button onClick={speechDataClickHandler}>Speech data</button>
        <button onClick={textDataClickHandler}>Text Data</button>
        <button onClick={paymentsClickHandler}>Payments</button>
        <button onClick={modelClickHandler}>LLM Model</button>
      </div>
      {showProfile && (
        <div className="mobileProfile">
          profile div
        </div>
      )}
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