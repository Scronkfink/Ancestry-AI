import React from "react";
import "../styles/settings.css"
import { useState } from "react";

const Settings = ({setShowSettings}) => {

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
    setShowSettings(false)
    return
  }

  return(
    <div className="settingsDisplay">
      <div className="navbar">
        <h1>Settings</h1>
        <button onClick={closeSettings}>X</button>
      </div>
      <div className="buttonsContainer">
        <button onClick={profileClickHandler}>Profile</button>
        <button onClick={speechDataClickHandler}>Speech data</button>
        <button onClick={textDataClickHandler}>Text Data</button>
        <button onClick={paymentsClickHandler}>Payments</button>
        <button onClick={modelClickHandler}>LLM Model</button>
      </div>
      {showProfile && (
        <div className="profile">
          profile div
        </div>
      )}
      {showSpeechData && (
        <div className="speechData">
          speech div
        </div>
      )}
      {showTextData && (
        <div className="textData">
          text div
        </div>
      )}
      {showPayments && (
        <div className="payments">
          payments div
        </div>
      )}
      {showModel && (
        <div className="model">
          model div
        </div>
      )}
    </div>
  )
}

export default Settings